<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => ['message' => 'Method not allowed']]));
}

// ===== CONFIG =====
$config = require_once 'config.php';
$API_KEY = $config['nvidia_api_key'];
$API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
$DAILY_LIMIT = $config['daily_limit'];

// ===== RATE LIMITING =====
$ip = getClientIP();
$limitFile = sys_get_temp_dir() . '/prompt_limits.json';

// Limitleri oku
$limits = [];
if (file_exists($limitFile)) {
    $limits = json_decode(file_get_contents($limitFile), true) ?: [];
}

// Eski kayıtları temizle (24 saatten eski)
$now = time();
foreach ($limits as $key => $data) {
    if ($now - $data['first_request'] > 86400) {
        unset($limits[$key]);
    }
}

// IP kontrolü
$ipHash = hash('sha256', $ip . date('Y-m-d'));
if (!isset($limits[$ipHash])) {
    $limits[$ipHash] = ['count' => 0, 'first_request' => $now];
}

$remaining = $DAILY_LIMIT - $limits[$ipHash]['count'];

// Limit aşıldı mı?
if ($limits[$ipHash]['count'] >= $DAILY_LIMIT) {
    die(json_encode([
        'error' => ['message' => 'Günlük limit aşıldı. Yarın tekrar deneyin.'],
        'limit' => ['used' => $limits[$ipHash]['count'], 'total' => $DAILY_LIMIT, 'remaining' => 0]
    ]));
}

// ===== REQUEST =====
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['messages'])) {
    http_response_code(400);
    die(json_encode(['error' => ['message' => 'Invalid request']]));
}

// API isteği
$payload = json_encode([
    'model' => $data['model'] ?? 'moonshotai/kimi-k2-instruct',
    'messages' => $data['messages'],
    'temperature' => $data['temperature'] ?? 0.7,
    'top_p' => $data['top_p'] ?? 0.9,
    'max_tokens' => min($data['max_tokens'] ?? 1024, 2048)
]);

$ch = curl_init($API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $API_KEY
    ],
    CURLOPT_TIMEOUT => 60,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    die(json_encode(['error' => ['message' => 'API bağlantı hatası']]));
}

$result = json_decode($response, true);

// Başarılıysa limiti artır
if ($httpCode === 200 && isset($result['choices'])) {
    $limits[$ipHash]['count']++;
    file_put_contents($limitFile, json_encode($limits));
    $remaining = $DAILY_LIMIT - $limits[$ipHash]['count'];
}

// Limit bilgisini ekle
$result['limit'] = [
    'used' => $limits[$ipHash]['count'],
    'total' => $DAILY_LIMIT,
    'remaining' => max(0, $remaining)
];

http_response_code($httpCode);
echo json_encode($result);

// ===== FUNCTIONS =====
function getClientIP() {
    $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}
