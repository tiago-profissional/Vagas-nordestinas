<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

try {
    $stmt = $pdo->query("SELECT 1");
    $result = $stmt->fetchColumn();

    echo json_encode([
        "success" => true,
        "message" => "Conexão com banco funcionando",
        "test" => $result
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}