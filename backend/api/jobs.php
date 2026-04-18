<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

$method = $_SERVER["REQUEST_METHOD"];

function respond($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function readJsonBody(): array {
    $raw = file_get_contents("php://input");
    $body = json_decode($raw, true);

    if (!is_array($body)) {
        respond(400, ["ok" => false, "error" => "Invalid JSON"]);
    }

    return $body;
}

function normalizeSalary($value) {
    if ($value === "" || $value === null) return null;
    if (is_numeric($value)) return (float)$value;
    return null;
}

if ($method === "GET") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([":id" => $id]);
        $job = $stmt->fetch();

        if (!$job) {
            respond(404, ["ok" => false, "error" => "Job not found"]);
        }

        respond(200, ["ok" => true, "data" => $job]);
    }

    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY id DESC");
    $jobs = $stmt->fetchAll();

    respond(200, ["ok" => true, "data" => $jobs]);
}

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
        respond(422, ["ok" => false, "error" => "Missing required fields"]);
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
    $created = $stmt2->fetch();

    respond(201, ["ok" => true, "data" => $created]);
}

if ($method === "PUT") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if (!$id) {
        respond(400, ["ok" => false, "error" => "ID is required"]);
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
        respond(422, ["ok" => false, "error" => "Missing required fields"]);
    }

    $check = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
    $check->execute([":id" => $id]);
    $existing = $check->fetch();

    if (!$existing) {
        respond(404, ["ok" => false, "error" => "Job not found"]);
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
    $updated = $stmt2->fetch();

    respond(200, ["ok" => true, "data" => $updated]);
}

if ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : null;

    if (!$id) {
        respond(400, ["ok" => false, "error" => "ID is required"]);
    }

    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        respond(404, ["ok" => false, "error" => "Job not found"]);
    }

    respond(200, ["ok" => true, "message" => "Job removed"]);
}

respond(405, ["ok" => false, "error" => "Method not allowed"]);