<?php
// =====================
// CORS (OBRIGATÓRIO)
// =====================
header("Access-Control-Allow-Origin: https://vagas-nordestinas.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight (IMPORTANTE)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// =====================
// CONEXÃO
// =====================
require_once __DIR__ . "/db.php";

$method = $_SERVER["REQUEST_METHOD"];

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

// =====================
// GET - LISTAR
// =====================
if ($method === "GET") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([":id" => $id]);
        $job = $stmt->fetch();

        if (!$job) {
            respond(404, ["error" => "Job not found"]);
        }

        respond(200, $job);
    }

    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
    $jobs = $stmt->fetchAll();

    respond(200, $jobs);
}

// =====================
// POST - CRIAR
// =====================
if ($method === "POST") {
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

    $sql = "INSERT INTO jobs 
    (title, company, city, state, work_mode, employment_type, salary_min, salary_max, description)
    VALUES 
    (:title, :company, :city, :state, :work_mode, :employment_type, :salary_min, :salary_max, :description)";

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

// =====================
// PUT - ATUALIZAR
// =====================
if ($method === "PUT") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if (!$id) {
        respond(400, ["error" => "ID is required"]);
    }

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

    if (!$check->fetch()) {
        respond(404, ["error" => "Job not found"]);
    }

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

// =====================
// DELETE - REMOVER
// =====================
if ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if (!$id) {
        respond(400, ["error" => "ID is required"]);
    }

    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        respond(404, ["error" => "Job not found"]);
    }

    respond(200, ["message" => "Job removed"]);
}

// =====================
// MÉTODO INVÁLIDO
// =====================
respond(405, ["error" => "Method not allowed"]);