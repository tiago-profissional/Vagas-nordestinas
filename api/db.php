<?php
// public/db.php - Funciona localmente e no ngrok

// Tenta detectar se está rodando localmente ou no ngrok
$is_local = ($_SERVER['HTTP_HOST'] ?? '') === 'localhost:8000';

if ($is_local) {
    // Configuração LOCAL (XAMPP)
    $host = "localhost";
    $dbname = "vagas_nordestinas";
    $username = "root";
    $password = "";
} else {
    // Configuração REMOTA (ngrok) - usando o banco do InfinityFree
    $host = "sql306.infinityfree.com";
    $dbname = "if0_41689928_vagas";
    $username = "if0_41689928";
    $password = "f7f9WkLEsToUl2";
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "MySQL connection failed: " . $e->getMessage()]);
    exit;
}
?>