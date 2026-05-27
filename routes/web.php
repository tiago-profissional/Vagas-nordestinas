<?php
// routes/web.php

// Inclui o Router
require_once __DIR__ . '/../src/Router.php';

// CORS headers para desenvolvimento
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Instancia o router
$router = new Router('/Vagas-nordestinas/public');

// ============= ROTAS PÚBLICAS =============

// Health check
$router->get('/', function() {
    response([
        'status' => 'success',
        'message' => 'API Vagas Nordestinas',
        'version' => '2.0',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});

// Jobs
$router->get('/jobs', 'JobController@index');      // Listar todos
$router->get('/jobs/:id', 'JobController@show');   // Buscar um
$router->post('/jobs', 'JobController@store');     // Criar
$router->put('/jobs/:id', 'JobController@update'); // Atualizar
$router->delete('/jobs/:id', 'JobController@destroy'); // Deletar

// Autenticação
$router->post('/login', 'AuthController@login');
$router->post('/register', 'AuthController@register');
$router->post('/logout', 'AuthController@logout');

// ============= ROTAS PROTEGIDAS =============
$router->get('/dashboard', function() {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        response(['error' => 'Unauthorized'], 401);
    }
    response(['message' => 'Welcome to dashboard', 'user_id' => $_SESSION['user_id']]);
});

// ============= FALLBACK =============
$router->match(['GET', 'POST', 'PUT', 'DELETE'], '*', function() {
    response(['error' => 'Route not found'], 404);
});

return $router;