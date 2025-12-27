<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$config = require_once 'config.php';
$DAILY_LIMIT = $config['daily_limit'];

$ip = getClientIP();
$limitFile = sys_get_temp_dir() . '/prompt_limits.json';

$limits = [];
if (file_exists($limitFile)) {
    $limits = json_decode(file_get_contents($limitFile), true) ?: [];
}

$ipHash = hash('sha256', $ip . date('Y-m-d'));
$used = $limits[$ipHash]['count'] ?? 0;

echo json_encode([
    'limit' => [
        'used' => $used,
        'total' => $DAILY_LIMIT,
        'remaining' => max(0, $DAILY_LIMIT - $used)
    ]
]);

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
