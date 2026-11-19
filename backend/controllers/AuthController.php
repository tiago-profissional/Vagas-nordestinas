<?php
namespace Controllers;

class AuthController
{
    private function jsonBody()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!is_array($data)) {
            response(["message" => "Corpo JSON inválido."], 400);
        }
        return $data;
    }

    private function publicUser(array $user)
    {
        unset($user["password"]);
        return $user;
    }

    private function sessionResponse(array $user, $status = 200)
    {
        $accessToken = \JwtHelper::generateToken(
            $user["id"],
            $user["email"],
            $user["name"],
            $user["role"] ?? "user"
        );
        $refreshToken = \JwtHelper::generateRefreshToken(
            $user["id"],
            $user["email"]
        );

        response([
            "success" => true,
            "message" => "Autenticação realizada com sucesso.",
            "user" => $this->publicUser($user),
            "access_token" => $accessToken,
            "refresh_token" => $refreshToken,
            "expires_in" => 3600,
        ], $status);
    }

    public function login()
    {
        $data = $this->jsonBody();
        $email = strtolower(trim($data["email"] ?? ""));
        $password = $data["password"] ?? "";
        if (!$email || !is_string($password) || $password === "") {
            response(["success" => false, "message" => "Informe e-mail e senha."], 400);
        }

        $stmt = \getDB()->prepare(
            "SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1"
        );
        $stmt->execute([":email" => $email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user["password"])) {
            response(["success" => false, "message" => "E-mail ou senha inválidos."], 401);
        }

        $this->sessionResponse($user);
    }

    public function register()
    {
        $data = $this->jsonBody();
        $name = trim($data["name"] ?? "");
        $email = strtolower(trim($data["email"] ?? ""));
        $password = $data["password"] ?? "";
        $confirmPassword = $data["confirmPassword"] ?? $password;

        if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(["success" => false, "message" => "Informe nome e e-mail válidos."], 422);
        }
        if (!is_string($password) || strlen($password) < 8) {
            response(["success" => false, "message" => "A senha deve ter no mínimo 8 caracteres."], 422);
        }
        if (!is_string($confirmPassword) || $password !== $confirmPassword) {
            response(["success" => false, "message" => "As senhas informadas não coincidem."], 422);
        }

        $db = \getDB();
        $stmt = $db->prepare(
            "SELECT id FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1"
        );
        $stmt->execute([":email" => $email]);
        if ($stmt->fetch()) {
            response(["success" => false, "message" => "Este e-mail já está cadastrado."], 409);
        }

        $stmt = $db->prepare(
            "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)"
        );
        try {
            $stmt->execute([
                ":name" => $name,
                ":email" => $email,
                ":password" => password_hash($password, PASSWORD_DEFAULT),
            ]);
        } catch (\PDOException $error) {
            if ($error->getCode() === "23000") {
                response(["success" => false, "message" => "Este e-mail já está cadastrado."], 409);
            }
            throw $error;
        }

        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([":id" => $db->lastInsertId()]);
        $this->sessionResponse($stmt->fetch(), 201);
    }

    public function refresh()
    {
        $data = $this->jsonBody();
        $decoded = \JwtHelper::validateToken($data["refresh_token"] ?? "");
        if (!$decoded || ($decoded["type"] ?? null) !== "refresh") {
            response(["error" => "Refresh token inválido ou expirado."], 401);
        }

        $stmt = \getDB()->prepare(
            "SELECT id, email, name, role FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1"
        );
        $stmt->execute([":id" => $decoded["sub"]]);
        $user = $stmt->fetch();
        if (!$user) {
            response(["error" => "Usuário não encontrado."], 401);
        }

        response([
            "success" => true,
            "access_token" => \JwtHelper::generateToken(
                $user["id"],
                $user["email"],
                $user["name"],
                $user["role"] ?? "user"
            ),
            "expires_in" => 3600,
        ]);
    }

    public function logout()
    {
        response(["success" => true, "message" => "Sessão encerrada no cliente."]);
    }
}
