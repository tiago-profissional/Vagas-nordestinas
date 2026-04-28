<?php
// backend/router.php - Versão Super Simplificada

class Router {
    private $routes = [];

    public function get($path, $handler) {
        $this->routes['GET'][$path] = $handler;
        return $this;
    }

    public function post($path, $handler) {
        $this->routes['POST'][$path] = $handler;
        return $this;
    }

    public function put($path, $handler) {
        $this->routes['PUT'][$path] = $handler;
        return $this;
    }

    public function delete($path, $handler) {
        $this->routes['DELETE'][$path] = $handler;
        return $this;
    }

    public function dispatch($uri, $method) {
        // Remove query string
        $uri = strtok($uri, '?');
        
        // Remove barra do final
        $uri = rtrim($uri, '/');
        if (empty($uri)) $uri = '/';
        
        foreach ($this->routes[$method] ?? [] as $path => $handler) {
            // Converte :id para regex
            $pattern = $path;
            $pattern = str_replace('/', '\/', $pattern);
            $pattern = preg_replace('/:([a-zA-Z0-9_]+)/', '([^\/]+)', $pattern);
            $pattern = '/^' . $pattern . '$/';
            
            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                
                // Extrai nomes dos parâmetros
                preg_match_all('/:([a-zA-Z0-9_]+)/', $path, $paramNames);
                $params = [];
                foreach ($paramNames[1] as $index => $name) {
                    $params[$name] = $matches[$index] ?? null;
                }
                
                return $this->execute($handler, $params);
            }
        }
        
        $this->send404($uri);
    }

    private function execute($handler, $params) {
        if (is_callable($handler)) {
            return $handler($params);
        }
        
        if (is_string($handler) && strpos($handler, '@')) {
            list($controller, $method) = explode('@', $handler);
            $controllerClass = "Controllers\\{$controller}";
            
            if (!class_exists($controllerClass)) {
                $file = __DIR__ . "/controllers/{$controller}.php";
                if (file_exists($file)) require_once $file;
            }
            
            if (class_exists($controllerClass)) {
                $obj = new $controllerClass();
                if (method_exists($obj, $method)) {
                    return $obj->$method($params);
                }
            }
        }
        
        return null;
    }

    private function send404($uri) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Route not found', 'path' => $uri, 'method' => $_SERVER['REQUEST_METHOD']]);
        exit;
    }
}

if (!function_exists('response')) {
    function response($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}