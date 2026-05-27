<?php
header('Content-Type: application/json');

$database_url = getenv('DATABASE_URL');

echo json_encode([
    'status' => 'success',
    'message' => 'PHP is working on Vercel!',
    'database_url_exists' => $database_url ? 'Yes' : 'No',
    'php_version' => PHP_VERSION,
    'time' => date('Y-m-d H:i:s')
]);
?>