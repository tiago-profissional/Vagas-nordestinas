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

    echo "Conectado com sucesso 🚀";

} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}