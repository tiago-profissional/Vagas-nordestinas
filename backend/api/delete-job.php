<?php
require_once __DIR__ . "/headers.php";
require_once __DIR__ . "/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST" && $_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
    exit;
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON"
    ]);
    exit;
}

$id = isset($data["id"]) ? (int)$data["id"] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Valid ID required"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Job not found"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Job deleted successfully",
        "deletedId" => $id
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}