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
if (!$input || empty($input['url'])) {
    die(json_encode(['error' => 'URL gerekli']));
}

$url = trim($input['url']);
if (!preg_match('/^https?:\/\//', $url)) {
    $url = 'https://' . $url;
}

// YouTube özel işlem
if (preg_match('/youtube\.com|youtu\.be/', $url)) {
    echo json_encode(fetchYouTube($url));
    exit();
}

// Genel site - birden fazla yöntem dene
$result = null;

// Yöntem 1: Scraping API servisleri
$scrapingServices = [
    'https://api.scraperapi.com/scrape?api_key=free&url=' . urlencode($url),
    'https://scrape.do/?token=free&url=' . urlencode($url)
];

// Yöntem 2: Web Archive
$archiveUrl = 'https://web.archive.org/web/2024/' . $url;

// Yöntem 3: Google Cache
$cacheUrl = 'https://webcache.googleusercontent.com/search?q=cache:' . urlencode($url) . '&strip=1';

// Yöntem 4: Direkt fetch
$methods = [
    ['name' => 'direct', 'url' => $url],
    ['name' => 'archive', 'url' => $archiveUrl],
    ['name' => 'cache', 'url' => $cacheUrl]
];

foreach ($methods as $method) {
    $html = fetchWithCurl($method['url']);
    
    if ($html && strlen($html) > 1000 && !isBlocked($html)) {
        echo json_encode([
            'success' => true,
            'html' => $html,
            'method' => $method['name']
        ]);
        exit();
    }
}

// Hiçbiri çalışmadı
echo json_encode(['error' => 'Bu siteye erişilemiyor. Site Cloudflare veya benzeri koruma kullanıyor olabilir.']);

// ===== FUNCTIONS =====

function fetchWithCurl($url) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_ENCODING => 'gzip, deflate',
        CURLOPT_HTTPHEADER => [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language: tr-TR,tr;q=0.9,en;q=0.8',
            'Cache-Control: no-cache',
            'Upgrade-Insecure-Requests: 1'
        ],
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    ]);
    
    $response = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ($code >= 200 && $code < 400) ? $response : null;
}

function isBlocked($html) {
    $blocked = [
        'cf-browser-verification',
        'Just a moment',
        'Checking your browser',
        'Enable JavaScript and cookies',
        'Attention Required',
        'Access denied',
        'Please Wait',
        'DDoS protection'
    ];
    
    foreach ($blocked as $text) {
        if (stripos($html, $text) !== false) {
            return true;
        }
    }
    return false;
}

function fetchYouTube($url) {
    // Kanal
    if (preg_match('/@([a-zA-Z0-9_-]+)/', $url, $m)) {
        return fetchYouTubeChannel($m[1]);
    }
    // Video
    if (preg_match('/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $m)) {
        return fetchYouTubeVideo($m[1]);
    }
    return ['error' => 'YouTube URL tanınamadı'];
}

function fetchYouTubeChannel($handle) {
    $url = "https://www.youtube.com/@{$handle}";
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => [
            'Accept-Language: tr-TR,tr;q=0.9',
            'Cookie: CONSENT=YES+1; PREF=hl=tr'
        ],
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36'
    ]);
    
    $html = curl_exec($ch);
    curl_close($ch);
    
    if (!$html) return ['error' => 'YouTube sayfası yüklenemedi'];
    
    $info = ['handle' => $handle];
    
    // Kanal adı
    if (preg_match('/"title":"([^"]+)"/', $html, $m)) $info['name'] = $m[1];
    elseif (preg_match('/og:title" content="([^"]+)"/', $html, $m)) $info['name'] = html_entity_decode($m[1]);
    
    // Açıklama
    if (preg_match('/"description":"([^"]*)"/', $html, $m)) $info['description'] = stripcslashes($m[1]);
    
    // Abone
    if (preg_match('/"subscriberCountText"[^}]*"simpleText":"([^"]+)"/', $html, $m)) $info['subscribers'] = $m[1];
    
    // Video sayısı
    if (preg_match('/(\d+)\s*video/', $html, $m)) $info['videos'] = $m[1];
    
    // Son videolar
    preg_match_all('/"title":\{"runs":\[\{"text":"([^"]{10,80})"\}/', $html, $matches);
    $videos = array_unique($matches[1] ?? []);
    $videos = array_slice($videos, 0, 8);
    
    $content = "YOUTUBE KANALI\n";
    $content .= "Kanal: " . ($info['name'] ?? '@'.$handle) . "\n";
    $content .= "URL: {$url}\n";
    if (!empty($info['subscribers'])) $content .= "Abone: " . $info['subscribers'] . "\n";
    if (!empty($info['videos'])) $content .= "Video Sayısı: " . $info['videos'] . "\n";
    if (!empty($info['description'])) $content .= "\nAçıklama: " . $info['description'] . "\n";
    if (!empty($videos)) {
        $content .= "\nSon Videolar:\n";
        foreach ($videos as $i => $v) $content .= "- " . $v . "\n";
    }
    
    return ['success' => true, 'content' => $content, 'type' => 'youtube'];
}

function fetchYouTubeVideo($id) {
    $url = "https://www.youtube.com/watch?v={$id}";
    
    // oEmbed
    $oembed = json_decode(file_get_contents("https://www.youtube.com/oembed?url={$url}&format=json"), true);
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['Cookie: CONSENT=YES+1'],
        CURLOPT_USERAGENT => 'Mozilla/5.0 Chrome/121.0.0.0'
    ]);
    $html = curl_exec($ch);
    curl_close($ch);
    
    $info = [
        'title' => $oembed['title'] ?? '',
        'author' => $oembed['author_name'] ?? ''
    ];
    
    if (preg_match('/"shortDescription":"([^"]*)"/', $html, $m)) $info['description'] = stripcslashes($m[1]);
    if (preg_match('/"viewCount":"(\d+)"/', $html, $m)) $info['views'] = number_format((int)$m[1]);
    
    $content = "YOUTUBE VIDEO\n";
    $content .= "Başlık: " . $info['title'] . "\n";
    $content .= "Kanal: " . $info['author'] . "\n";
    if (!empty($info['views'])) $content .= "Görüntülenme: " . $info['views'] . "\n";
    if (!empty($info['description'])) $content .= "\nAçıklama: " . substr($info['description'], 0, 1000) . "\n";
    
    return ['success' => true, 'content' => $content, 'type' => 'youtube'];
}
