<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

try {
    $stmt = $pdo->query("SELECT 1");
    $result = $stmt->fetchColumn();

    echo json_encode([
        "ok" => true,
        "message" => "Database connection working",
        "test" => $result
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}