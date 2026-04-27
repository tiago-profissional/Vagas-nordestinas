<?php
// public/db.php - PARA RAILWAY

$host = getenv('MYSQLHOST');
$port = getenv('MYSQLPORT');
$dbname = getenv('MYSQLDATABASE');
$username = getenv('MYSQLUSER');
$password = getenv('MYSQLPASSWORD');

// Se as variáveis não existirem, tenta conexão local (fallback)
if (!$host) {
    $host = "localhost";
    $dbname = "vagas_nordestinas";
    $username = "root";
    $password = "";
}

$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "MySQL connection failed: " . $e->getMessage()]);
    exit;
}
?>