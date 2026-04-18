<?php
$host = "sql306.infinityfree.com";
$dbname = "if0_41689928_vagas";
$username = "if0_41689928";
$password = "f7f9WkLEsToUl2";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "Database connection failed: " . $e->getMessage()
    ]);
    exit;
}