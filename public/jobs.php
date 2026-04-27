<?php
// CORS HEADERS - VERSÃO SIMPLIFICADA
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/db.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;
    
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([":id" => $id]);
        $job = $stmt->fetch();
        
        if (!$job) {
            http_response_code(404);
            echo json_encode(["error" => "Job not found"]);
            exit;
        }
        
        echo json_encode($job);
        exit;
    }
    
    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $title = trim($data["title"] ?? "");
    $company = trim($data["company"] ?? "");
    $city = trim($data["city"] ?? "");
    $state = trim($data["state"] ?? "");
    $work_mode = $data["work_mode"] ?? "remote";
    $employment_type = $data["employment_type"] ?? "full_time";
    $salary_min = !empty($data["salary_min"]) ? (float)$data["salary_min"] : null;
    $salary_max = !empty($data["salary_max"]) ? (float)$data["salary_max"] : null;
    $description = trim($data["description"] ?? "");
    
    if (!$title || !$company || !$city || !$state) {
        http_response_code(422);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO jobs (title, company, city, state, work_mode, employment_type, salary_min, salary_max, description)
                           VALUES (:title, :company, :city, :state, :work_mode, :employment_type, :salary_min, :salary_max, :description)");
    
    $stmt->execute([
        ":title" => $title,
        ":company" => $company,
        ":city" => $city,
        ":state" => $state,
        ":work_mode" => $work_mode,
        ":employment_type" => $employment_type,
        ":salary_min" => $salary_min,
        ":salary_max" => $salary_max,
        ":description" => $description
    ]);
    
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Job created", "id" => $pdo->lastInsertId()]);
    exit;
}

if ($method === "PUT") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID required"]);
        exit;
    }
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $title = trim($data["title"] ?? "");
    $company = trim($data["company"] ?? "");
    $city = trim($data["city"] ?? "");
    $state = trim($data["state"] ?? "");
    $work_mode = $data["work_mode"] ?? "remote";
    $employment_type = $data["employment_type"] ?? "full_time";
    $salary_min = !empty($data["salary_min"]) ? (float)$data["salary_min"] : null;
    $salary_max = !empty($data["salary_max"]) ? (float)$data["salary_max"] : null;
    $description = trim($data["description"] ?? "");
    
    $stmt = $pdo->prepare("UPDATE jobs SET 
        title = :title,
        company = :company,
        city = :city,
        state = :state,
        work_mode = :work_mode,
        employment_type = :employment_type,
        salary_min = :salary_min,
        salary_max = :salary_max,
        description = :description
        WHERE id = :id");
    
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
    
    echo json_encode(["success" => true, "message" => "Job updated"]);
    exit;
}

if ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID required"]);
        exit;
    }
    
    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([":id" => $id]);
    
    echo json_encode(["success" => true, "message" => "Job deleted"]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>