<?php
$database_url = getenv('DATABASE_URL');

if (!$database_url) {
    // Fallback local (XAMPP / InfinityFree)
    $host = "sql306.infinityfree.com";
    $dbname = "if0_41689928_vagas";
    $username = "if0_41689928";
    $password = "f7f9WkLEsToUl2";

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
} else {
    // Neon PostgreSQL para Vercel
    $parsed = parse_url($database_url);
    $host = $parsed['host'];
    $port = $parsed['port'] ?? 5432;
    $dbname = ltrim($parsed['path'], '/');
    $user = $parsed['user'];
    $password = $parsed['pass'] ?? '';

    try {
        $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "PostgreSQL connection failed: " . $e->getMessage()]);
        exit;
    }
}
?>