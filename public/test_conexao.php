<?php
// Teste de conexão simples
$host = "localhost";
$dbname = "vagas_nordestinas";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Conta as tabelas
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    
    echo json_encode([
        "status" => "success",
        "message" => "Conectado!",
        "database" => $dbname,
        "tables" => array_column($tables, "Tables_in_vagas_nordestinas")
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}