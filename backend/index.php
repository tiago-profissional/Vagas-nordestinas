<?php

// backend/index.php

$allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://vagasnordestinas.com",
    "https://www.vagasnordestinas.com",
];
$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");
header("Content-Type: application/json; charset=UTF-8");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "OPTIONS") {
    http_response_code(204);
    exit();
}

error_reporting(E_ALL);
ini_set("display_errors", "0");

require_once __DIR__ . "/router.php";

set_exception_handler(function ($error) {
    error_log((string) $error);
    if (!headers_sent()) {
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
    }
    response(["error" => "Erro interno da API."], 500);
});

require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/config/database.php";
require_once __DIR__ . "/jwt_helper.php";

spl_autoload_register(function ($class) {
    if (strpos($class, "Controllers\\") !== 0) {
        return;
    }

    $className = substr($class, 12);
    $file = __DIR__ . "/controllers/" . $className . ".php";
    if (file_exists($file)) {
        require_once $file;
    }
});

$router = new Router();

$router->get("/test", function () {
    response(["success" => true, "message" => "Router OK!"]);
});

$router->get("/", function () {
    response(["status" => "online", "api" => "Vagas Nordestinas"]);
});

$router->get("/jobs", "JobController@index");
$router->get("/jobs/my-applications", "JobController@myApplications");
$router->get("/jobs/:id", "JobController@show");
$router->post("/jobs", "JobController@store");
$router->post("/jobs/:id/apply", "JobController@apply");
$router->put("/jobs/:id", "JobController@update");
$router->delete("/jobs/:id", "JobController@destroy");

$router->post("/auth/login", "AuthController@login");
$router->post("/auth/register", "AuthController@register");
$router->post("/auth/forgot-password", "AuthController@forgotPassword");
$router->post("/auth/reset-password", "AuthController@resetPassword");
$router->post("/auth/refresh", "AuthController@refresh");
$router->post("/auth/logout", "AuthController@logout");

$router->get("/users/profile", "UserController@profile");
$router->put("/users/profile", "UserController@updateProfile");
$router->post("/users/profile/avatar", "UserController@uploadAvatar");
$router->delete("/users/account", "UserController@deleteAccount");
$router->get("/users/admin/all", "UserController@listUsers");
$router->patch("/users/admin/role/:id", "UserController@changeRole");

$route = $_GET["route"] ?? "/";
if ($route === "") {
    $route = "/";
}
if ($route[0] !== "/") {
    $route = "/" . $route;
}

$router->dispatch($route, $_SERVER["REQUEST_METHOD"]);
