<?php
// backend/jwt_helper.php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper {
    private static function secret()
    {
        $secret = function_exists("vnEnv") ? vnEnv("JWT_SECRET") : getenv("JWT_SECRET");
        if (!$secret || strlen($secret) < 32) {
            throw new RuntimeException("Configure JWT_SECRET com pelo menos 32 caracteres aleatórios.");
        }
        return $secret;
    }

    public static function generateToken($userId, $email, $name = null, $role = "user") {
        $issuedAt = time();
        $expire = $issuedAt + 3600;
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
            'email' => $email,
            'name' => $name,
            'role' => $role,
            'type' => 'access',
        ];
        return JWT::encode($payload, self::secret(), "HS256");
    }

    public static function generateRefreshToken($userId, $email) {
        $issuedAt = time();
        $expire = $issuedAt + 604800;
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
            'email' => $email,
            'type' => 'refresh'
        ];
        return JWT::encode($payload, self::secret(), "HS256");
    }

    public static function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(self::secret(), "HS256"));
            return (array) $decoded;
        } catch(\Throwable $e) {
            return null;
        }
    }

    public static function isAuthenticated() {
        $headers = function_exists("getallheaders") ? getallheaders() : [];
        $authHeader = $_SERVER["HTTP_AUTHORIZATION"] ??
            $headers["Authorization"] ??
            $headers["authorization"] ??
            "";
        if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
            return null;
        }
        $user = self::validateToken($matches[1]);
        return $user && ($user["type"] ?? null) === "access" ? $user : null;
    }

    public static function requireAuth() {
        $user = self::isAuthenticated();
        if (!$user) {
            response(['error' => 'Unauthorized: Invalid or expired token'], 401);
        }
        $stmt = \getDB()->prepare(
            "SELECT role FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1"
        );
        $stmt->execute([":id" => $user["sub"]]);
        $role = $stmt->fetchColumn();
        if ($role === false) {
            response(["error" => "Sessão inválida ou conta inativa."], 401);
        }
        $user["role"] = $role;
        return $user;
    }

    public static function requireAdmin()
    {
        $user = self::requireAuth();
        if ($user["role"] !== "admin") {
            response(["error" => "Acesso restrito a administradores."], 403);
        }
        return $user;
    }
}