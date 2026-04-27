<?php
// public/db.php - PARA USO LOCAL (XAMPP)

$host = "localhost";
$dbname = "vagas_nordestinas";
$username = "root";
$password = "";

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