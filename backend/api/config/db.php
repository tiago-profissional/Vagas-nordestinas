<?php

     

    function db(): PDO 
    {
        // Troque esses dados pelos seus    

        $host = 'localhost';
        $dbname = 'vagas_nordestinas';
        $user = 'root';
        $pass = '';

        $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4;";

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            return new PDO($dsn, $user, $pass, $options);
        }catch (PDOException $e){
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');

            echo json_encode([
                "ok" => false,
                "error" => "Falha ao conectar no banco",
                "details" => $e->getMessage(),
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

?>