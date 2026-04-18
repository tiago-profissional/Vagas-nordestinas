<?php
require_once __DIR__ . "/headers.php";

echo json_encode([
    "ok" => true,
    "message" => "test.php is running before db.php"
]);
exit;