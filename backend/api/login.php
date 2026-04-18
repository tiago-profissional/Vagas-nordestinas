<?php
require_once __DIR__ . "/config/headers.php";
require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "error" => "Invalid JSON"
    ]);
    exit;
}

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($email === "" || $password === "") {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "error" => "Email and password are required."
    ]);
    exit;
}

try {
    $query = $pdo->prepare("
        SELECT id, name, email, password
        FROM users
        WHERE email = :email
        LIMIT 1
    ");
    $query->execute([":email" => $email]);

    $user = $query->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "ok" => false,
            "error" => "User not found."
        ]);
        exit;
    }

    if (!password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "ok" => false,
            "error" => "Invalid password."
        ]);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "message" => "Login successful.",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"]
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "Server error: " . $e->getMessage()
    ]);
}