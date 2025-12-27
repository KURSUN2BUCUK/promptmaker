<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode(['error' => 'Method not allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['query'])) {
    die(json_encode(['error' => 'Arama sorgusu gerekli']));
}

$query = trim($input['query']);

// Google arama sonuçlarını çek
$results = googleSearch($query);

if (empty($results)) {
    die(json_encode(['error' => 'Arama sonucu bulunamadı']));
}

// İlk 3-5 sonucun içeriğini çek
$contents = [];
$sources = [];

foreach (array_slice($results, 0, 4) as $result) {
    $content = fetchPageContent($result['url']);
    if ($content && strlen($content) > 200) {
        $contents[] = [
            'title' => $result['title'],
            'url' => $result['url'],
            'content' => substr($content, 0, 3000)
        ];
        $sources[] = [
            'title' => $result['title'],
            'url' => $result['url']
        ];
    }
    
    if (count($contents) >= 3) break;
}

if (empty($contents)) {
    // Sadece snippet'leri kullan
    foreach (array_slice($results, 0, 5) as $result) {
        $contents[] = [
            'title' => $result['title'],
            'url' => $result['url'],
            'content' => $result['snippet']
        ];
        $sources[] = [
            'title' => $result['title'],
            'url' => $result['url']
        ];
    }
}

echo json_encode([
    'success' => true,
    'contents' => $contents,
    'sources' => $sources
]);

// ===== FUNCTIONS =====

function googleSearch($query) {
    // DuckDuckGo HTML arama (daha güvenilir)
    $searchUrl = 'https://html.duckduckgo.com/html/?q=' . urlencode($query);
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $searchUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => [
            'Accept: text/html',
            'Accept-Language: tr-TR,tr;q=0.9'
        ],
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36'
    ]);
    
    $html = curl_exec($ch);
    curl_close($ch);
    
    if (!$html) return [];
    
    $results = [];
    
    // DuckDuckGo sonuçlarını parse et
    preg_match_all('/<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/', $html, $matches, PREG_SET_ORDER);
    
    foreach ($matches as $match) {
        $url = $match[1];
        $title = html_entity_decode(strip_tags($match[2]));
        
        // uddg redirect'i çöz
        if (strpos($url, 'uddg=') !== false) {
            parse_str(parse_url($url, PHP_URL_QUERY), $params);
            $url = $params['uddg'] ?? $url;
        }
        
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            $results[] = [
                'title' => $title,
                'url' => $url,
                'snippet' => ''
            ];
        }
    }
    
    // Snippet'leri de çek
    preg_match_all('/<a[^>]*class="result__snippet"[^>]*>([^<]+)</', $html, $snippets);
    foreach ($snippets[1] as $i => $snippet) {
        if (isset($results[$i])) {
            $results[$i]['snippet'] = html_entity_decode(strip_tags($snippet));
        }
    }
    
    return $results;
}

function fetchPageContent($url) {
    // Bazı siteleri atla
    $skipDomains = ['youtube.com', 'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com'];
    foreach ($skipDomains as $domain) {
        if (strpos($url, $domain) !== false) return null;
    }
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => [
            'Accept: text/html',
            'Accept-Language: tr-TR,tr;q=0.9'
        ],
        CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    ]);
    
    $html = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($code !== 200 || !$html) return null;
    
    // Cloudflare kontrolü
    if (strpos($html, 'cf-browser-verification') !== false || 
        strpos($html, 'Just a moment') !== false) {
        return null;
    }
    
    // HTML temizle
    $html = preg_replace('/<script[\s\S]*?<\/script>/i', '', $html);
    $html = preg_replace('/<style[\s\S]*?<\/style>/i', '', $html);
    $html = preg_replace('/<nav[\s\S]*?<\/nav>/i', '', $html);
    $html = preg_replace('/<footer[\s\S]*?<\/footer>/i', '', $html);
    $html = preg_replace('/<header[\s\S]*?<\/header>/i', '', $html);
    $html = preg_replace('/<!--[\s\S]*?-->/', '', $html);
    
    $text = strip_tags($html);
    $text = html_entity_decode($text);
    $text = preg_replace('/\s+/', ' ', $text);
    $text = trim($text);
    
    return $text;
}
