<?php
// api/index.php - ROUTER PRINCIPAL

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/cors.php"; // vou criar esse arquivo

$method = $_SERVER["REQUEST_METHOD"];
$path = $_SERVER["REQUEST_URI"];

// Remove query string da path
$path = strtok($path, '?');
// Remove o prefixo /api se existir
$path = str_replace('/api', '', $path);
$path = rtrim($path, '/');

// =====================
// ROTAS
// =====================

try {
    switch ($path) {
        // -----------------
        // Jobs
        // -----------------
        case '/jobs':
            handleJobs($method, $pdo);
            break;
            
        case preg_match('/\/jobs\/(\d+)/', $path, $matches) ? true : false:
            $id = (int)$matches[1];
            handleJobById($method, $id, $pdo);
            break;
        
        // -----------------
        // Auth
        // -----------------
        case '/login':
            handleLogin($method, $pdo);
            break;
            
        case '/register':
            handleRegister($method, $pdo);
            break;
        
        // -----------------
        // Test / Health
        // -----------------
        case '/test':
        case '/health':
            handleTest();
            break;
        
        // -----------------
        // 404
        // -----------------
        default:
            respond(404, ["error" => "Route not found: $path"]);
    }
} catch (Exception $e) {
    respond(500, ["error" => "Server error: " . $e->getMessage()]);
}

// =====================
// HANDLERS
// =====================

function handleJobs($method, $pdo) {
    if ($method === "GET") {
        $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
        $jobs = $stmt->fetchAll();
        respond(200, $jobs);
    }
    elseif ($method === "POST") {
        $body = readJsonBody();
        
        $title = trim($body["title"] ?? "");
        $company = trim($body["company"] ?? "");
        $city = trim($body["city"] ?? "");
        $state = trim($body["state"] ?? "");
        $work_mode = $body["work_mode"] ?? "remote";
        $employment_type = $body["employment_type"] ?? "full_time";
        $salary_min = normalizeSalary($body["salary_min"] ?? null);
        $salary_max = normalizeSalary($body["salary_max"] ?? null);
        $description = trim($body["description"] ?? "");
        
        if ($title === "" || $company === "" || $city === "" || $state === "") {
            respond(422, ["error" => "Missing required fields"]);
        }
        
        $sql = "INSERT INTO jobs (title, company, city, state, work_mode, employment_type, salary_min, salary_max, description)
                VALUES (:title, :company, :city, :state, :work_mode, :employment_type, :salary_min, :salary_max, :description)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":title" => $title,
            ":company" => $company,
            ":city" => $city,
            ":state" => $state,
            ":work_mode" => $work_mode,
            ":employment_type" => $employment_type,
            ":salary_min" => $salary_min,
            ":salary_max" => $salary_max,
            ":description" => $description,
        ]);
        
        $newId = (int)$pdo->lastInsertId();
        $stmt2 = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt2->execute([":id" => $newId]);
        
        respond(201, $stmt2->fetch());
    }
    else {
        respond(405, ["error" => "Method not allowed for /jobs"]);
    }
}

function handleJobById($method, $id, $pdo) {
    if ($method === "GET") {
        $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([":id" => $id]);
        $job = $stmt->fetch();
        
        if (!$job) respond(404, ["error" => "Job not found"]);
        respond(200, $job);
    }
    elseif ($method === "PUT") {
        $body = readJsonBody();
        
        $title = trim($body["title"] ?? "");
        $company = trim($body["company"] ?? "");
        $city = trim($body["city"] ?? "");
        $state = trim($body["state"] ?? "");
        $work_mode = $body["work_mode"] ?? "remote";
        $employment_type = $body["employment_type"] ?? "full_time";
        $salary_min = normalizeSalary($body["salary_min"] ?? null);
        $salary_max = normalizeSalary($body["salary_max"] ?? null);
        $description = trim($body["description"] ?? "");
        
        if ($title === "" || $company === "" || $city === "" || $state === "") {
            respond(422, ["error" => "Missing required fields"]);
        }
        
        $check = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $check->execute([":id" => $id]);
        if (!$check->fetch()) respond(404, ["error" => "Job not found"]);
        
        $sql = "UPDATE jobs SET 
            title = :title,
            company = :company,
            city = :city,
            state = :state,
            work_mode = :work_mode,
            employment_type = :employment_type,
            salary_min = :salary_min,
            salary_max = :salary_max,
            description = :description
            WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":title" => $title,
            ":company" => $company,
            ":city" => $city,
            ":state" => $state,
            ":work_mode" => $work_mode,
            ":employment_type" => $employment_type,
            ":salary_min" => $salary_min,
            ":salary_max" => $salary_max,
            ":description" => $description,
            ":id" => $id
        ]);
        
        $stmt2 = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt2->execute([":id" => $id]);
        respond(200, $stmt2->fetch());
    }
    elseif ($method === "DELETE") {
        $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
        $stmt->execute([":id" => $id]);
        
        if ($stmt->rowCount() === 0) respond(404, ["error" => "Job not found"]);
        respond(200, ["message" => "Job removed"]);
    }
    else {
        respond(405, ["error" => "Method not allowed"]);
    }
}

function handleLogin($method, $pdo) {
    if ($method !== "POST") {
        respond(405, ["error" => "Method not allowed"]);
    }
    
    $body = readJsonBody();
    $email = trim($body["email"] ?? "");
    $password = trim($body["password"] ?? "");
    
    if (!$email || !$password) {
        respond(400, ["success" => false, "message" => "Email and password are required."]);
    }
    
    $query = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = :email");
    $query->execute(["email" => $email]);
    $user = $query->fetch();
    
    if (!$user) {
        respond(401, ["success" => false, "message" => "User not found."]);
    }
    
    if (!password_verify($password, $user["password"])) {
        respond(401, ["success" => false, "message" => "Invalid password."]);
    }
    
    unset($user["password"]);
    respond(200, ["success" => true, "message" => "Login successful.", "user" => $user]);
}

function handleRegister($method, $pdo) {
    if ($method !== "POST") {
        respond(405, ["error" => "Method not allowed"]);
    }
    
    $body = readJsonBody();
    $name = trim($body["name"] ?? "");
    $email = trim($body["email"] ?? "");
    $password = trim($body["password"] ?? "");
    $confirmPassword = trim($body["confirmPassword"] ?? "");
    
    if (!$name || !$email || !$password || !$confirmPassword) {
        respond(400, ["success" => false, "message" => "All fields are required."]);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(400, ["success" => false, "message" => "Invalid email."]);
    }
    
    if ($password !== $confirmPassword) {
        respond(400, ["success" => false, "message" => "Passwords do not match."]);
    }
    
    if (strlen($password) < 6) {
        respond(400, ["success" => false, "message" => "Password must be at least 6 characters."]);
    }
    
    $check = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $check->execute(["email" => $email]);
    if ($check->fetch()) {
        respond(409, ["success" => false, "message" => "Email already registered."]);
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
    $stmt->execute(["name" => $name, "email" => $email, "password" => $hashedPassword]);
    
    respond(201, ["success" => true, "message" => "Account created successfully."]);
}

function handleTest() {
    respond(200, [
        "status" => "success",
        "message" => "API is working!",
        "php_version" => PHP_VERSION,
        "time" => date('Y-m-d H:i:s')
    ]);
}

// =====================
// FUNÇÕES AUXILIARES
// =====================

function respond($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function readJsonBody(): array {
    $raw = file_get_contents("php://input");
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        respond(400, ["error" => "Invalid JSON"]);
    }
    return $body;
}

function normalizeSalary($value) {
    if ($value === "" || $value === null) return null;
    if (is_numeric($value)) return (float)$value;
    return null;
}