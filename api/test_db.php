<?php
// test_db.php - Teste de conexão
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    require_once __DIR__ . "/db.php";
    
    // Tenta uma query simples
    $stmt = $pdo->query("SELECT 1 as test");
    $result = $stmt->fetch();
    
    echo json_encode([
        "status" => "success",
        "db_connected" => true,
        "test_query" => $result
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}