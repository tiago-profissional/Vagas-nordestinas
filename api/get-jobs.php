<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

    $stmt = $pdo->query("SELECT * FROM jobs");

    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($jobs);

} catch (PDOException $e) {
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}