<?php
    require __DIR__ . '/config/headers.php';
    require __DIR__ . '/config/db.php';

    $pdo = db();

    echo json_encode([
        "ok" => true,
        "message" => "Conectou no banco!",
    ], JSON_UNESCAPED_UNICODE);