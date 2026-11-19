<?php
namespace Controllers;

class UserController
{
    private function currentUserId(): int
    {
        $userId = \JwtHelper::requireAuth()["sub"] ?? null;
        if (is_string($userId) && ctype_digit($userId)) {
            $userId = (int) $userId;
        }
        if (!is_int($userId) || $userId < 1) {
            response(["message" => "Token sem identificador de usuário válido."], 401);
        }
        return $userId;
    }

    private function jsonBody()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!is_array($data)) {
            response(["message" => "Corpo JSON inválido."], 400);
        }
        return $data;
    }

    private function findUser(int $userId)
    {
        $stmt = \getDB()->prepare(
            "SELECT * FROM users WHERE id = :user_id AND deleted_at IS NULL LIMIT 1"
        );
        $stmt->execute([":user_id" => $userId]);
        $user = $stmt->fetch();
        if (!$user) {
            response(["message" => "Usuário não encontrado."], 404);
        }
        return $user;
    }

    private function profileData(array $user)
    {
        $skills = json_decode($user["skills"] ?? "[]", true);
        $skills = is_array($skills)
            ? array_values(array_filter($skills, "is_string"))
            : [];
        $completion = $this->profileCompletion($user, $skills);

        return [
            "personal_data" => [
                "id" => $user["id"],
                "name" => $user["name"],
                "email" => $user["email"],
                "phone" => $user["phone"],
                "city" => $user["city"],
                "state" => $user["state"],
                "bio" => $user["bio"] ?? "",
                "birth_date" => $user["birth_date"],
                "avatar_url" => $user["avatar_url"],
            ],
            "professional_preferences" => [
                "desired_role" => $user["desired_role"],
                "work_model" => $user["work_model"],
                "contract_type" => $user["contract_type"],
                "availability" => $user["availability"],
                "skills" => is_array($skills) ? $skills : [],
            ],
            "account_privacy" => [
                "allow_recruiters" => (bool) $user["allow_recruiters"],
                "email_recommendations" => (bool) $user["email_recommendations"],
            ],
            "profile_completion" => $completion,
            "meta" => ["profile_completion_percentage" => $completion],
        ];
    }

    private function profileCompletion(array $user, array $skills): int
    {
        $points = 0;
        foreach ([
            "name", "email", "phone", "city", "state", "birth_date",
            "desired_role", "avatar_url",
        ] as $field) {
            if (!empty($user[$field])) {
                $points += 10;
            }
        }
        foreach (["work_model", "contract_type", "availability"] as $field) {
            if (!empty($user[$field])) {
                $points += 5;
            }
        }
        if ($skills) {
            $points += 5;
        }
        return min(100, $points);
    }

    private function stringLength(string $value): int
    {
        return function_exists("mb_strlen")
            ? mb_strlen($value, "UTF-8")
            : strlen($value);
    }

    private function optionalString($value, int $maxLength, string $field)
    {
        if ($value === null) {
            return null;
        }
        if (!is_string($value)) {
            response(["message" => "{$field} inválido."], 422);
        }
        $value = trim($value);
        if ($value === "") {
            return null;
        }
        if ($this->stringLength($value) > $maxLength) {
            response(["message" => "{$field} excede o limite de {$maxLength} caracteres."], 422);
        }
        return $value;
    }

    private function optionalEnum($value, array $options, string $field)
    {
        if ($value === null || $value === "") {
            return null;
        }
        if (!is_string($value) || !in_array($value, $options, true)) {
            response(["message" => "Valor inválido para {$field}."], 422);
        }
        return $value;
    }

    private function booleanValue($value, bool $current, string $field): int
    {
        if ($value === null) {
            return $current ? 1 : 0;
        }
        if (is_bool($value)) {
            return $value ? 1 : 0;
        }
        if ($value === 1 || $value === "1" || $value === "true") {
            return 1;
        }
        if ($value === 0 || $value === "0" || $value === "false") {
            return 0;
        }
        response(["message" => "Valor inválido para {$field}."], 422);
    }

    private function skillsValue($value): array
    {
        if ($value === null) {
            $value = [];
        } elseif (is_string($value)) {
            $decoded = json_decode($value, true);
            $value = is_array($decoded)
                ? $decoded
                : array_map("trim", explode(",", $value));
        }

        if (!is_array($value)) {
            response(["message" => "O campo skills deve ser uma lista."], 422);
        }

        $skills = [];
        $seen = [];
        foreach (array_values($value) as $skill) {
            if (!is_string($skill)) {
                response(["message" => "Cada habilidade deve ser um texto."], 422);
            }
            $skill = trim($skill);
            if ($skill === "") {
                continue;
            }
            if ($this->stringLength($skill) > 40) {
                response(["message" => "Cada habilidade pode ter no máximo 40 caracteres."], 422);
            }
            $key = strtolower($skill);
            if (!isset($seen[$key])) {
                $skills[] = $skill;
                $seen[$key] = true;
            }
        }
        if (count($skills) > 30) {
            response(["message" => "Informe no máximo 30 habilidades."], 422);
        }
        return $skills;
    }

    private function storedAvatarPath(?string $url): ?string
    {
        if (!$url || strpos($url, "/api/uploads/avatars/") !== 0) {
            return null;
        }
        $filename = basename($url);
        if (!preg_match('/^[0-9]+_[a-f0-9]{24}\.(jpg|png|webp)$/i', $filename)) {
            return null;
        }
        return dirname(__DIR__) . "/uploads/avatars/" . $filename;
    }

    private function removeStoredAvatar(?string $url): void
    {
        $path = $this->storedAvatarPath($url);
        if ($path && is_file($path) && !unlink($path)) {
            error_log("Não foi possível remover um avatar substituído.");
        }
    }

    private function inputValue(array $data, array $groups, $key, $current)
    {
        foreach ($groups as $group) {
            if (isset($data[$group]) && is_array($data[$group]) && array_key_exists($key, $data[$group])) {
                return $data[$group][$key];
            }
        }
        return array_key_exists($key, $data) ? $data[$key] : $current;
    }

    private function birthDate($value)
    {
        if ($value === null || $value === "") {
            return null;
        }
        if (!is_string($value)) {
            response(["message" => "Data de nascimento inválida."], 422);
        }
        $date = \DateTime::createFromFormat("!Y-m-d", $value);
        $errors = \DateTime::getLastErrors();
        if (
            !$date ||
            ($errors && ($errors["warning_count"] || $errors["error_count"])) ||
            $date->format("Y-m-d") !== $value ||
            $value < "1900-01-01" ||
            $value > date("Y-m-d")
        ) {
            response(["message" => "Data de nascimento inválida."], 422);
        }
        return $date->format("Y-m-d");
    }

    public function profile()
    {
        $user = $this->findUser($this->currentUserId());
        response(["success" => true, "data" => $this->profileData($user)]);
    }

    public function updateProfile()
    {
        $id = $this->currentUserId();
        $data = $this->jsonBody();
        $user = $this->findUser($id);
        $personalGroups = ["personal_data", "personalData"];
        $professionalGroups = ["professional_preferences", "professionalPreferences"];
        $privacyGroups = ["account_privacy", "accountPrivacy"];

        $name = $this->optionalString(
            $this->inputValue($data, $personalGroups, "name", $user["name"]),
            120,
            "Nome"
        );
        if (!$name || $this->stringLength($name) < 2) {
            response(["message" => "O nome deve ter pelo menos 2 caracteres."], 422);
        }
        $emailValue = $this->inputValue($data, $personalGroups, "email", $user["email"]);
        if (!is_string($emailValue)) {
            response(["message" => "E-mail inválido."], 422);
        }
        $email = strtolower(trim($emailValue));
        if ($this->stringLength($email) > 255 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(["message" => "Nome e e-mail válidos são obrigatórios."], 422);
        }

        $db = \getDB();
        if ($email !== $user["email"]) {
            $check = $db->prepare(
                "SELECT id FROM users WHERE email = :email AND id <> :user_id LIMIT 1"
            );
            $check->execute([":email" => $email, ":user_id" => $id]);
            if ($check->fetch()) {
                response(["message" => "Este e-mail já está em uso."], 409);
            }
        }

        $phone = $this->optionalString(
            $this->inputValue($data, $personalGroups, "phone", $user["phone"]),
            30,
            "Telefone"
        );
        $city = $this->optionalString(
            $this->inputValue($data, $personalGroups, "city", $user["city"]),
            100,
            "Cidade"
        );
        $state = $this->optionalString(
            $this->inputValue($data, $personalGroups, "state", $user["state"]),
            100,
            "Estado"
        );
        $bio = $this->optionalString(
            $this->inputValue($data, $personalGroups, "bio", $user["bio"] ?? null),
            5000,
            "Biografia"
        );
        $birthDate = $this->birthDate(
            $this->inputValue($data, $personalGroups, "birth_date",
                $this->inputValue($data, $personalGroups, "birthDate", $user["birth_date"]))
        );
        $desiredRole = $this->optionalString(
            $this->inputValue($data, $professionalGroups, "desired_role",
                $this->inputValue($data, $professionalGroups, "desiredRole", $user["desired_role"])),
            255,
            "Cargo desejado"
        );

        $workModel = $this->inputValue($data, $professionalGroups, "work_model",
            $this->inputValue($data, $professionalGroups, "workModel", $user["work_model"]));
        $contractType = $this->inputValue($data, $professionalGroups, "contract_type",
            $this->inputValue($data, $professionalGroups, "contractType", $user["contract_type"]));
        $availability = $this->inputValue($data, $professionalGroups, "availability", $user["availability"]);
        $workModel = $this->optionalEnum($workModel, ["Remoto", "Híbrido", "Presencial"], "work_model");
        $contractType = $this->optionalEnum($contractType, ["CLT", "PJ", "CLT ou PJ"], "contract_type");
        $availability = $this->optionalEnum($availability, ["Imediata", "15 dias", "30 dias", "A combinar"], "availability");
        $skills = $this->skillsValue(
            $this->inputValue($data, $professionalGroups, "skills", $user["skills"])
        );
        $skillsJson = json_encode($skills, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

        $allowRecruiters = $this->inputValue($data, $privacyGroups, "allow_recruiters", $user["allow_recruiters"]);
        $emailRecommendations = $this->inputValue($data, $privacyGroups, "email_recommendations", $user["email_recommendations"]);
        $allowRecruiters = $this->booleanValue($allowRecruiters, (bool) $user["allow_recruiters"], "Privacidade");
        $emailRecommendations = $this->booleanValue($emailRecommendations, (bool) $user["email_recommendations"], "Recomendações por e-mail");

        $stmt = $db->prepare(
            "UPDATE users SET name = :name, email = :email, phone = :phone, city = :city, bio = :bio,
             state = :state, birth_date = :birth_date, desired_role = :desired_role,
             work_model = :work_model, contract_type = :contract_type,
             availability = :availability, skills = :skills,
             allow_recruiters = :allow_recruiters,
             email_recommendations = :email_recommendations, updated_at = NOW()
             WHERE id = :user_id AND deleted_at IS NULL"
        );
        $stmt->execute([
            ":name" => $name,
            ":email" => $email,
            ":phone" => $phone,
            ":city" => $city,
            ":bio" => $bio,
            ":state" => $state,
            ":birth_date" => $birthDate,
            ":desired_role" => $desiredRole,
            ":work_model" => $workModel,
            ":contract_type" => $contractType,
            ":availability" => $availability,
            ":skills" => $skillsJson,
            ":allow_recruiters" => $allowRecruiters,
            ":email_recommendations" => $emailRecommendations,
            ":user_id" => $id,
        ]);

        response([
            "success" => true,
            "message" => "Perfil atualizado com sucesso.",
            "data" => $this->profileData($this->findUser($id)),
        ]);
    }

    public function uploadAvatar()
    {
        $userId = $this->currentUserId();
        $user = $this->findUser($userId);
        $file = $_FILES["avatar"] ?? null;
        if (
            !is_array($file) ||
            !isset($file["error"], $file["size"], $file["tmp_name"]) ||
            $file["error"] !== UPLOAD_ERR_OK ||
            $file["size"] < 1 ||
            $file["size"] > 3 * 1024 * 1024 ||
            !is_uploaded_file($file["tmp_name"])
        ) {
            response(["message" => "Envie uma imagem de até 3 MB."], 422);
        }

        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file["tmp_name"]);
        $extensions = [
            "image/jpeg" => "jpg",
            "image/png" => "png",
            "image/webp" => "webp",
        ];
        if (!isset($extensions[$mime])) {
            response(["message" => "Formato inválido. Use JPG, PNG ou WEBP."], 422);
        }

        $directory = dirname(__DIR__) . "/uploads/avatars";
        if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
            throw new \RuntimeException("Não foi possível preparar o diretório de avatares.");
        }
        $filename = $userId . "_" . bin2hex(random_bytes(12)) . "." . $extensions[$mime];
        $newFilePath = $directory . "/" . $filename;
        if (!move_uploaded_file($file["tmp_name"], $newFilePath)) {
            throw new \RuntimeException("Não foi possível salvar o avatar enviado.");
        }

        $avatarUrl = "/api/uploads/avatars/" . $filename;
        try {
            $stmt = \getDB()->prepare(
                "UPDATE users SET avatar_url = :avatar_url, updated_at = NOW()
                 WHERE id = :user_id AND deleted_at IS NULL"
            );
            $stmt->execute([":avatar_url" => $avatarUrl, ":user_id" => $userId]);
            if ($stmt->rowCount() !== 1) {
                throw new \RuntimeException("Não foi possível atualizar o avatar do usuário autenticado.");
            }
        } catch (\Throwable $error) {
            if (is_file($newFilePath) && !unlink($newFilePath)) {
                error_log("Não foi possível limpar o avatar enviado após falha no banco.");
            }
            throw $error;
        }

        $this->removeStoredAvatar($user["avatar_url"] ?? null);
        $updated = $this->findUser($userId);
        response([
            "success" => true,
            "message" => "Foto de perfil atualizada.",
            "avatar_url" => $avatarUrl,
            "data" => $this->profileData($updated),
        ]);
    }

    public function deleteAccount()
    {
        $userId = $this->currentUserId();
        $user = $this->findUser($userId);
        $stmt = \getDB()->prepare(
            "UPDATE users SET deleted_at = NOW(), updated_at = NOW()
             WHERE id = :user_id AND deleted_at IS NULL"
        );
        $stmt->execute([":user_id" => $userId]);
        $this->removeStoredAvatar($user["avatar_url"] ?? null);
        response(["success" => true, "message" => "Conta excluída com sucesso."]);
    }

    public function listUsers()
    {
        \JwtHelper::requireAdmin();
        $stmt = \getDB()->query(
            "SELECT id, name, email, role FROM users WHERE deleted_at IS NULL ORDER BY id DESC"
        );
        response(["success" => true, "data" => $stmt->fetchAll()]);
    }

    public function changeRole($params)
    {
        \JwtHelper::requireAdmin();
        $data = $this->jsonBody();
        $role = $data["role"] ?? "";
        if (!in_array($role, ["user", "recruiter", "admin"], true)) {
            response(["message" => "Papel de usuário inválido."], 422);
        }
        $stmt = \getDB()->prepare(
            "UPDATE users SET role = :role, updated_at = NOW() WHERE id = :id AND deleted_at IS NULL"
        );
        $stmt->execute([":role" => $role, ":id" => $params["id"]]);
        if (!$stmt->rowCount()) {
            $this->findUser($params["id"]);
        }
        response(["success" => true, "message" => "Papel atualizado com sucesso."]);
    }
}