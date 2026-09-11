<?php
// backend/jwt_helper.php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Configuração do JWT - CHAVE MAIS FORTE
define('JWT_SECRET', 'vagas-nordestinas-chave-secreta-ultra-segura-2026');
define('JWT_ALGO', 'HS256');
define('JWT_EXPIRES', 3600); // 1 hora em segundos
define('JWT_REFRESH_EXPIRES', 86400 * 7); // 7 dias

class JwtHelper {
    
    // Gerar token de acesso
    public static function generateToken($userId, $email, $name = null) {
        $issuedAt = time();
        $expire = $issuedAt + JWT_EXPIRES;
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
            'email' => $email,
            'name' => $name,
            'type' => 'access'
        ];
        
        return JWT::encode($payload, JWT_SECRET, JWT_ALGO);
    }
    
    // Gerar refresh token
    public static function generateRefreshToken($userId, $email) {
        $issuedAt = time();
        $expire = $issuedAt + JWT_REFRESH_EXPIRES;
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'sub' => $userId,
            'email' => $email,
            'type' => 'refresh'
        ];
        
        return JWT::encode($payload, JWT_SECRET, JWT_ALGO);
    }
    
    // Validar e decodificar token
    public static function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGO));
            return (array) $decoded;
        } catch(Exception $e) {
            return null;
        }
    }
    
    // Verificar se token é válido
    public static function isAuthenticated() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader)) {
            return null;
        }
        
        $token = str_replace('Bearer ', '', $authHeader);
        return self::validateToken($token);
    }
    
    // Middleware para rotas protegidas
    public static function requireAuth() {
        $user = self::isAuthenticated();
        
        if (!$user) {
            response(['error' => 'Unauthorized: Invalid or expired token'], 401);
        }
        
        return $user;
    }
}