<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");
$confirmPassword = trim($data["confirmPassword"] ?? "");

if (!$name || !$email || !$password || !$confirmPassword) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email."
    ]);
    exit;
}

if ($password !== $confirmPassword) {
    echo json_encode([
        "success" => false,
        "message" => "Passwords do not match."
    ]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 6 characters."
    ]);
    exit;
}

try {
    $check = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $check->execute(["email" => $email]);

    if ($check->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Email already registered."
        ]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password)
        VALUES (:name, :email, :password)
    ");

    $stmt->execute([
        "name" => $name,
        "email" => $email,
        "password" => $hashedPassword
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Account created successfully."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}