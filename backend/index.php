<?php

// backend/index.php

// =========================
// CORS
// =========================

$allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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

// Responde ao preflight do navegador
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

// =========================
// ERROS
// =========================

error_reporting(E_ALL);
ini_set("display_errors", 1);

// =========================
// ROUTER
// =========================

require_once __DIR__ . "/router.php";

// =========================
// AUTOLOAD DOS CONTROLLERS
// =========================

spl_autoload_register(function ($class) {

    if (strpos($class, "Controllers\\") === 0) {

        $className = substr($class, 12);

        $file =
            __DIR__ .
            "/controllers/" .
            $className .
            ".php";

        if (file_exists($file)) {
            require_once $file;
        }
    }
});

// =========================
// BANCO
// =========================

if (file_exists(__DIR__ . "/config/database.php")) {

    require_once __DIR__ . "/config/database.php";

} else {

    if (!function_exists("getDB")) {

        function getDB()
        {
            try {

                $pdo = new PDO(
                    "mysql:host=localhost;dbname=vagas_nordestinas;charset=utf8",
                    "root",
                    ""
                );

                $pdo->setAttribute(
                    PDO::ATTR_ERRMODE,
                    PDO::ERRMODE_EXCEPTION
                );

                $pdo->setAttribute(
                    PDO::ATTR_DEFAULT_FETCH_MODE,
                    PDO::FETCH_ASSOC
                );

                return $pdo;

            } catch (PDOException $e) {

                response(
                    [
                        "error" =>
                            "Database error: " .
                            $e->getMessage()
                    ],
                    500
                );
            }
        }
    }
}

// =========================
// ROTAS
// =========================

$router = new Router();

$router->get("/test", function () {

    response([
        "success" => true,
        "message" => "Router OK!"
    ]);
});

$router->get("/", function () {

    response([
        "status" => "online",
        "api" => "Vagas Nordestinas"
    ]);
});

// Vagas
$router->get(
    "/jobs",
    "JobController@index"
);

$router->get(
    "/jobs/:id",
    "JobController@show"
);

$router->post(
    "/jobs",
    "JobController@store"
);

$router->put(
    "/jobs/:id",
    "JobController@update"
);

$router->delete(
    "/jobs/:id",
    "JobController@destroy"
);

// Vagas GitHub
$router->get(
    "/github-jobs",
    "GithubJobController@index"
);

$router->get(
    "/github-jobs/:id",
    "GithubJobController@show"
);

// =========================
// DESPACHAR ROTA
// =========================

$route = $_GET["route"] ?? "/";

if (empty($route)) {
    $route = "/";
}

if ($route[0] !== "/") {
    $route = "/" . $route;
}

$router->dispatch(
    $route,
    $_SERVER["REQUEST_METHOD"]
);