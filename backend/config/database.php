<?php
// backend/config/database.php

function getDB() {
    $host = 'localhost';
    $dbname = 'vagas_nordestinas';
    $user = 'root';
    $pass = '';
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch(PDOException $e) {
        response(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
    }
}