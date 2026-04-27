<?php
// test_simple.php - Teste básico
echo json_encode([
    "status" => "success",
    "message" => "PHP está funcionando!",
    "timestamp" => date('Y-m-d H:i:s')
]);