<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit;
}

$query = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = :email");
$query->execute(["email" => $email]);
$user = $query->fetch();

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
    exit;
}

unset($user["password"]);
echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
?>