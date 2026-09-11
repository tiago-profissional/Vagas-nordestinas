<?php
// backend/index.php - Versão Corrigida (sem getDB duplicado)

// CORS
$allowedOrigins = [
    "http://localhost:5173",
    "https://vagasnordestinas.com",
    "https://www.vagasnordestinas.com"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/router.php';

// Autoload para controllers
spl_autoload_register(function($class) {
    if (strpos($class, 'Controllers\\') === 0) {
        $className = substr($class, 11);
        $file = __DIR__ . '/controllers/' . $className . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
});

// Carregar configuração do banco (se existir)
if (file_exists(__DIR__ . '/config/database.php')) {
    require_once __DIR__ . '/config/database.php';
} else {
    if (!function_exists('getDB')) {
        function getDB() {
            try {
                $pdo = new PDO("mysql:host=localhost;dbname=vagas_nordestinas;charset=utf8", 'root', '');
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                return $pdo;
            } catch(PDOException $e) {
                response(['error' => 'Database error: ' . $e->getMessage()], 500);
            }
        }
    }
}

$router = new Router();

// Rotas
$router->get('/test', function() {
    response(['success' => true, 'message' => 'Router OK!']);
});

$router->get('/', function() {
    response(['status' => 'online', 'api' => 'Vagas Nordestinas']);
});

$router->get('/jobs', 'JobController@index');
$router->get('/jobs/:id', 'JobController@show');
$router->post('/jobs', 'JobController@store');
$router->put('/jobs/:id', 'JobController@update');
$router->delete('/jobs/:id', 'JobController@destroy');

// ===== NOVA ROTA — vagas do GitHub =====
$router->get('/github-jobs', 'GithubJobController@index');
$router->get('/github-jobs/:id', 'GithubJobController@show');

// Pega a rota do parâmetro GET 'route'
$route = $_GET['route'] ?? '/';
if (empty($route)) $route = '/';
if ($route[0] !== '/') $route = '/' . $route;

$router->dispatch($route, $_SERVER['REQUEST_METHOD']);