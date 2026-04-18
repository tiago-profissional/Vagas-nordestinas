<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "error" => "Invalid JSON"
    ]);
    exit;
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");
$confirmPassword = trim($data["confirmPassword"] ?? "");

if ($name === "" || $email === "" || $password === "" || $confirmPassword === "") {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "error" => "All fields are required."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "error" => "Invalid email."
    ]);
    exit;
}

if ($password !== $confirmPassword) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "error" => "Passwords do not match."
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "error" => "Password must be at least 6 characters."
    ]);
    exit;
}

try {
    $check = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $check->execute([":email" => $email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode([
            "ok" => false,
            "error" => "Email already registered."
        ]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password)
        VALUES (:name, :email, :password)
    ");

    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":password" => $hashedPassword
    ]);

    echo json_encode([
        "ok" => true,
        "message" => "Account created successfully."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "Server error: " . $e->getMessage()
    ]);
}