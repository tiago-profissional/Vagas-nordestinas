<?php
require_once __DIR__ . "/config/headers.php";
require_once __DIR__ . "/config/db.php";

try {
  $pdo = db();
  echo json_encode([
    "ok" => true,
    "message" => "Conectou no banco!",
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "error" => "Falha ao conectar no banco",
  ], JSON_UNESCAPED_UNICODE);
}