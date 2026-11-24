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

    private function frontendUrl()
    {
        $configuredUrl = getenv("FRONTEND_URL");
        if (is_string($configuredUrl) && $configuredUrl !== "") {
            $parts = parse_url($configuredUrl);
            if (is_array($parts)) {
                $scheme = strtolower($parts["scheme"] ?? "");
                if (
                    in_array($scheme, ["http", "https"], true) &&
                    isset($parts["host"])
                ) {
                    $port = isset($parts["port"]) ? ":" . $parts["port"] : "";
                    return $scheme . "://" . $parts["host"] . $port;
                }
            }
        }

        $origin = $_SERVER["HTTP_ORIGIN"] ?? "";
        $allowedOrigins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://vagasnordestinas.com",
            "https://www.vagasnordestinas.com",
        ];

        return in_array($origin, $allowedOrigins, true)
            ? $origin
            : "https://vagasnordestinas.com";
    }

    private function sendPasswordResetEmail($email, $token)
    {
        $resetUrl = rtrim($this->frontendUrl(), "/")
            . "/reset-password?token="
            . rawurlencode($token);
        $subject = "Recuperacao de senha - Vagas Nordestinas";
        $message = "Recebemos uma solicitacao para redefinir sua senha.\n\n"
            . "Acesse o link abaixo em ate 30 minutos para criar uma nova senha:\n"
            . $resetUrl
            . "\n\nSe voce nao solicitou essa alteracao, ignore este e-mail.";
        $headers = [
            "From: Vagas Nordestinas <no-reply@vagasnordestinas.com>",
            "Content-Type: text/plain; charset=UTF-8",
            "Content-Transfer-Encoding: 8bit",
        ];

        if (!mail($email, $subject, $message, implode("\r\n", $headers))) {
            throw new \RuntimeException("O servidor de e-mail recusou a mensagem.");
        }
    }

    public function forgotPassword()
    {
        header("Cache-Control: no-store");
        $data = $this->jsonBody();
        $email = $data["email"] ?? "";

        if (!is_string($email)) {
            response(["message" => "Informe um e-mail válido."], 400);
        }
        $email = strtolower(trim($email));

        if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(["message" => "Informe um e-mail válido."], 400);
        }

        $genericMessage = "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.";
        $db = \getDB();
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash("sha256", $token);

        try {
            $db->beginTransaction();
            $stmt = $db->prepare(
                "SELECT id, email FROM users
                 WHERE email = :email AND deleted_at IS NULL
                 LIMIT 1 FOR UPDATE"
            );
            $stmt->execute([":email" => $email]);
            $user = $stmt->fetch();

            if (!$user) {
                $db->commit();
                response(["success" => true, "message" => $genericMessage]);
            }

            $stmt = $db->prepare("DELETE FROM password_resets WHERE user_id = :user_id");
            $stmt->execute([":user_id" => $user["id"]]);
            $stmt = $db->prepare(
                "INSERT INTO password_resets (user_id, token_hash, expires_at)
                 VALUES (:user_id, :token_hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 MINUTE))"
            );
            $stmt->execute([
                ":user_id" => $user["id"],
                ":token_hash" => $tokenHash,
            ]);
            $db->commit();

            try {
                $this->sendPasswordResetEmail($user["email"], $token);
            } catch (\Throwable $error) {
                $stmt = $db->prepare(
                    "DELETE FROM password_resets
                     WHERE user_id = :user_id AND token_hash = :token_hash"
                );
                $stmt->execute([
                    ":user_id" => $user["id"],
                    ":token_hash" => $tokenHash,
                ]);
                throw $error;
            }

            response(["success" => true, "message" => $genericMessage]);
        } catch (\Throwable $error) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            error_log("Erro ao solicitar redefinição de senha: " . $error->getMessage());
            response(
                ["success" => false, "message" => "Não foi possível enviar as instruções. Tente novamente mais tarde."],
                500
            );
        }
    }

    public function resetPassword()
    {
        header("Cache-Control: no-store");
        $data = $this->jsonBody();
        $token = $data["token"] ?? "";
        $password = $data["password"] ?? "";
        $passwordConfirm = $data["passwordConfirm"] ?? "";

        if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/', $token)) {
            response(["success" => false, "message" => "Token inválido ou expirado."], 400);
        }
        if (!is_string($password) || strlen($password) < 8 || strlen($password) > 72) {
            response(["success" => false, "message" => "A senha deve ter entre 8 e 72 bytes."], 400);
        }
        if (!is_string($passwordConfirm) || $password !== $passwordConfirm) {
            response(["success" => false, "message" => "As senhas informadas não coincidem."], 400);
        }

        $db = \getDB();
        try {
            $db->beginTransaction();
            $stmt = $db->prepare(
                "SELECT user_id FROM password_resets
                 WHERE token_hash = :token_hash
                   AND expires_at > UTC_TIMESTAMP()
                   AND used_at IS NULL
                 LIMIT 1 FOR UPDATE"
            );
            $stmt->execute([":token_hash" => hash("sha256", $token)]);
            $reset = $stmt->fetch();

            if (!$reset) {
                $db->rollBack();
                response(["success" => false, "message" => "Token inválido ou expirado."], 400);
            }

            $stmt = $db->prepare(
                "UPDATE users SET password = :password
                 WHERE id = :user_id AND deleted_at IS NULL"
            );
            $stmt->execute([
                ":password" => password_hash($password, PASSWORD_DEFAULT),
                ":user_id" => $reset["user_id"],
            ]);

            if ($stmt->rowCount() !== 1) {
                throw new \RuntimeException("A conta associada ao token não está disponível.");
            }

            $stmt = $db->prepare(
                "UPDATE password_resets SET used_at = UTC_TIMESTAMP()
                 WHERE user_id = :user_id AND used_at IS NULL"
            );
            $stmt->execute([":user_id" => $reset["user_id"]]);
            $db->commit();

            response(["success" => true, "message" => "Senha redefinida com sucesso."]);
        } catch (\Throwable $error) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            error_log("Erro ao redefinir senha: " . $error->getMessage());
            response(
                ["success" => false, "message" => "Não foi possível redefinir a senha. Tente novamente."],
                500
            );
        }
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
