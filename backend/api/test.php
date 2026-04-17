<?php

$host = "sql306.infinityfree.com";
$dbname = "if0_41689928_vagas";
$username = "if0_41689928";
$password = "f7f9WkLEsToUl2";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);

    $sql = "INSERT INTO jobs (title, company, city, description)
            VALUES ('Dev React', 'Empresa X', 'Recife', 'Trabalho remoto')";

    $pdo->exec($sql);

    echo "Inserido com sucesso 🚀";

} catch (PDOException $e) {
    echo $e->getMessage();
}