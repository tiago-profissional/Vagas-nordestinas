<?php
// backend/teste_jwt.php
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// CHAVE MAIS LONGA (mínimo 16 caracteres)
$key = 'minha-chave-secreta-muito-forte-12345678';
$payload = [
    'user_id' => 1,
    'email' => 'teste@email.com',
    'exp' => time() + 3600
];

$token = JWT::encode($payload, $key, 'HS256');
echo "Token gerado: " . $token . "\n\n";

$decoded = JWT::decode($token, new Key($key, 'HS256'));
echo "Token decodificado: \n";
print_r($decoded);