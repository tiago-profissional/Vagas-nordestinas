<?php
require_once __DIR__ . "/config/headers.php";
require_once __DIR__ . "/config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "error" => "Method not allowed"
    ]);
    exit;
}

$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "error" => "Valid ID required"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([":id" => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "ok" => false,
            "error" => "Job not found"
        ]);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "message" => "Job deleted successfully",
        "deletedId" => $id
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}