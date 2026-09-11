<?php

function getDB()
{
    $serverName = $_SERVER["SERVER_NAME"] ?? "";
    $isLocal = in_array(
        $serverName,
        ["localhost", "127.0.0.1"],
        true
    );

    if ($isLocal) {
        // XAMPP
        $host = "localhost";
        $dbname = "vagas_nordestinas";
        $user = "root";
        $pass = "";
    } else {
        // Hostinger
        $host = "localhost";
        $dbname = "NOME_DO_BANCO_HOSTINGER";
        $user = "USUARIO_DO_BANCO_HOSTINGER";
        $pass = "COLOQUE_A_NOVA_SENHA_AQUI";
    }

    try {
        $pdo = new PDO(
            "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
            $user,
            $pass
        );

        $pdo->setAttribute(
            PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION
        );

        $pdo->setAttribute(
            PDO::ATTR_DEFAULT_FETCH_MODE,
            PDO::FETCH_ASSOC
        );

        return $pdo;
    } catch (PDOException $e) {
        throw new RuntimeException(
            "Falha ao conectar ao banco de dados.",
            0,
            $e
        );
    }
}