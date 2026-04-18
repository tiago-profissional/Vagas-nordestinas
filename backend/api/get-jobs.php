<?php
require_once __DIR__ . "/config/headers.php";
require_once __DIR__ . "/config/db.php";

try {
    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
    $jobs = $stmt->fetchAll();

    echo json_encode([
        "ok" => true,
        "data" => $jobs
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}