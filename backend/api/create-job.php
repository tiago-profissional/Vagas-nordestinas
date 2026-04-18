<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "error" => "Method not allowed"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "error" => "Invalid JSON"
    ]);
    exit;
}

$title = trim($data["title"] ?? "");
$company = trim($data["company"] ?? "");
$city = trim($data["city"] ?? "");
$state = trim($data["state"] ?? "");
$work_mode = $data["work_mode"] ?? "remote";
$employment_type = $data["employment_type"] ?? "full_time";
$salary_min = isset($data["salary_min"]) && $data["salary_min"] !== "" ? (float)$data["salary_min"] : null;
$salary_max = isset($data["salary_max"]) && $data["salary_max"] !== "" ? (float)$data["salary_max"] : null;
$description = trim($data["description"] ?? "");

if ($title === "" || $company === "" || $city === "" || $state === "") {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "error" => "Missing required fields"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO jobs (title, company, city, state, work_mode, employment_type, salary_min, salary_max, description)
        VALUES (:title, :company, :city, :state, :work_mode, :employment_type, :salary_min, :salary_max, :description)
    ");

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

    $newId = (int)$pdo->lastInsertId();

    $getStmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
    $getStmt->execute([":id" => $newId]);
    $createdJob = $getStmt->fetch();

    echo json_encode([
        "ok" => true,
        "message" => "Job created successfully",
        "data" => $createdJob
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}