<?php

function vnLoadLocalEnv()
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $loaded = true;

    $serverName = $_SERVER["SERVER_NAME"] ?? "";
    if (!in_array($serverName, ["localhost", "127.0.0.1"], true)) {
        return;
    }

    $envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . ".env";
    if (!is_file($envFile)) {
        return;
    }
    if (!is_readable($envFile)) {
        throw new RuntimeException("O arquivo backend/.env não está acessível.");
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES);
    if ($lines === false) {
        throw new RuntimeException("Não foi possível ler o arquivo backend/.env.");
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === "" || $line[0] === "#") {
            continue;
        }

        $separator = strpos($line, "=");
        if ($separator === false) {
            continue;
        }

        $name = trim(substr($line, 0, $separator));
        if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $name)) {
            continue;
        }
        if (
            (getenv($name) !== false && getenv($name) !== "") ||
            (isset($_SERVER[$name]) && $_SERVER[$name] !== "") ||
            (isset($_ENV[$name]) && $_ENV[$name] !== "")
        ) {
            continue;
        }

        $value = trim(substr($line, $separator + 1));
        if (strlen($value) >= 2) {
            $first = $value[0];
            $last = substr($value, -1);
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $value = substr($value, 1, -1);
            }
        }

        putenv($name . "=" . $value);
    }
}

function vnEnv($name, $default = null)
{
    vnLoadLocalEnv();

    $value = getenv($name);
    if ($value !== false && $value !== "") {
        return $value;
    }

    if (isset($_SERVER[$name]) && $_SERVER[$name] !== "") {
        return $_SERVER[$name];
    }

    if (isset($_ENV[$name]) && $_ENV[$name] !== "") {
        return $_ENV[$name];
    }

    return $default;
}

function getDB()
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $serverName = $_SERVER["SERVER_NAME"] ?? "";
    $isLocalRequest = in_array($serverName, ["localhost", "127.0.0.1"], true);
    $host = vnEnv("DB_HOST", $isLocalRequest ? "localhost" : null);
    $dbname = vnEnv("DB_NAME", $isLocalRequest ? "vagas_nordestinas" : null);
    $user = vnEnv("DB_USER", $isLocalRequest ? "root" : null);
    $password = vnEnv("DB_PASSWORD", $isLocalRequest ? "" : null);
    $port = vnEnv("DB_PORT", "3306");

    if (!$host || !$dbname || !$user || $password === null) {
        throw new RuntimeException("As variáveis DB_HOST, DB_NAME, DB_USER e DB_PASSWORD precisam ser configuradas.");
    }

    $isLocalDatabase = in_array(strtolower($host), ["localhost", "127.0.0.1"], true);
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $sslCa = vnEnv("DB_SSL_CA");
    if (!$isLocalDatabase) {
        if (!$sslCa || !is_file($sslCa) || !is_readable($sslCa)) {
            throw new RuntimeException("Configure DB_SSL_CA com o caminho legível do certificado CA da Aiven.");
        }
        if (!defined("PDO::MYSQL_ATTR_SSL_CA") ||
            !defined("PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT")) {
            throw new RuntimeException("A extensão PDO MySQL precisa oferecer suporte a SSL.");
        }

        $options[constant("PDO::MYSQL_ATTR_SSL_CA")] = $sslCa;
        $options[constant("PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT")] = true;
    } elseif ($sslCa) {
        if (!is_file($sslCa) || !is_readable($sslCa)) {
            throw new RuntimeException("O arquivo informado em DB_SSL_CA não está acessível.");
        }
        if (defined("PDO::MYSQL_ATTR_SSL_CA")) {
            $options[constant("PDO::MYSQL_ATTR_SSL_CA")] = $sslCa;
            if (defined("PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT")) {
                $options[constant("PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT")] = true;
            }
        }
    }

    $dsn = sprintf(
        "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
        $host,
        $port,
        $dbname
    );

    try {
        $pdo = new PDO($dsn, $user, $password, $options);
    } catch (PDOException $error) {
        error_log("Database connection failed: " . $error->getMessage());
        throw new RuntimeException("Não foi possível conectar ao banco de dados.");
    }

    return $pdo;
}
