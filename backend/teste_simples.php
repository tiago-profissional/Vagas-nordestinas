<?php
// backend/teste_simples.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

echo json_encode([
    'status' => 'success',
    'message' => 'PHP está funcionando!',
    'timestamp' => date('Y-m-d H:i:s')
]);