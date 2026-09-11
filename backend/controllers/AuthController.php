<?php
// backend/controllers/AuthController.php
namespace Controllers;

require_once __DIR__ . '/../jwt_helper.php';

class AuthController {
    
    private function getDB() {
        try {
            $pdo = new \PDO("mysql:host=localhost;dbname=vagas_nordestinas;charset=utf8mb4", 'root', '');
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch(\PDOException $e) {
            response(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
    }
    
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');
        
        if (!$email || !$password) {
            response(['success' => false, 'message' => 'Email and password required'], 400);
        }
        
        $db = $this->getDB();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            response(['success' => false, 'message' => 'User not found'], 401);
        }
        
        if (!password_verify($password, $user['password'])) {
            response(['success' => false, 'message' => 'Invalid password'], 401);
        }
        
        // GERAR TOKENS JWT
        $accessToken = \JwtHelper::generateToken($user['id'], $user['email'], $user['name']);
        $refreshToken = \JwtHelper::generateRefreshToken($user['id'], $user['email']);
        
        // Remover senha
        unset($user['password']);
        
        response([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_in' => 3600
        ]);
    }
    
    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');
        $confirmPassword = trim($data['confirmPassword'] ?? '');
        
        if (!$name || !$email || !$password || !$confirmPassword) {
            response(['success' => false, 'message' => 'All fields required'], 400);
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(['success' => false, 'message' => 'Invalid email'], 400);
        }
        
        if ($password !== $confirmPassword) {
            response(['success' => false, 'message' => 'Passwords do not match'], 400);
        }
        
        if (strlen($password) < 6) {
            response(['success' => false, 'message' => 'Password must be at least 6 characters'], 400);
        }
        
        $db = $this->getDB();
        
        $check = $db->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute([':email' => $email]);
        if ($check->fetch()) {
            response(['success' => false, 'message' => 'Email already registered'], 409);
        }
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $db->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);
        
        response([
            'success' => true,
            'message' => 'Account created successfully'
        ], 201);
    }
    
    // Refresh token endpoint
    public function refresh() {
        $data = json_decode(file_get_contents('php://input'), true);
        $refreshToken = $data['refresh_token'] ?? '';
        
        if (!$refreshToken) {
            response(['error' => 'Refresh token required'], 400);
        }
        
        $decoded = \JwtHelper::validateToken($refreshToken);
        
        if (!$decoded || $decoded['type'] !== 'refresh') {
            response(['error' => 'Invalid refresh token'], 401);
        }
        
        // Gerar novo access token
        $newAccessToken = \JwtHelper::generateToken(
            $decoded['sub'], 
            $decoded['email']
        );
        
        response([
            'success' => true,
            'access_token' => $newAccessToken,
            'expires_in' => 3600
        ]);
    }
    
    // Logout (opcional - token blacklist)
    public function logout() {
        // Aqui você pode implementar blacklist de tokens
        response(['success' => true, 'message' => 'Logged out successfully']);
    }
}