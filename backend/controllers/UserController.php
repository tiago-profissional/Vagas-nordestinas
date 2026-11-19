<?php
namespace Controllers;

class UserController
{
    private function currentUserId()
    {
        return \JwtHelper::requireAuth()["sub"];
    }

    private function jsonBody()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!is_array($data)) {
            response(["message" => "Corpo JSON inválido."], 400);
        }
        return $data;
    }

    private function findUser($id)
    {
        $stmt = \getDB()->prepare(
            "SELECT * FROM users WHERE id = :id AND deleted_at IS NULL LIMIT 1"
        );
        $stmt->execute([":id" => $id]);
        $user = $stmt->fetch();
        if (!$user) {
            response(["message" => "Usuário não encontrado."], 404);
        }
        return $user;
    }

    private function profileData(array $user)
    {
        $skills = json_decode($user["skills"] ?? "[]", true);
        return [
            "personal_data" => [
                "id" => $user["id"],
                "name" => $user["name"],
                "email" => $user["email"],
                "phone" => $user["phone"],
                "city" => $user["city"],
                "state" => $user["state"],
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
        ];
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

    private function optionalString($value)
    {
        if ($value === null || trim((string) $value) === "") {
            return null;
        }
        return trim((string) $value);
    }

    private function birthDate($value)
    {
        if ($value === null || $value === "") {
            return null;
        }
        $date = \DateTime::createFromFormat("!Y-m-d", (string) $value);
        if (!$date || $date->format("Y-m-d") !== $value) {
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

        $name = trim((string) $this->inputValue($data, $personalGroups, "name", $user["name"]));
        $email = strtolower(trim((string) $this->inputValue($data, $personalGroups, "email", $user["email"])));
        if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(["message" => "Nome e e-mail válidos são obrigatórios."], 422);
        }

        $db = \getDB();
        if ($email !== $user["email"]) {
            $check = $db->prepare(
                "SELECT id FROM users WHERE email = :email AND id <> :id LIMIT 1"
            );
            $check->execute([":email" => $email, ":id" => $id]);
            if ($check->fetch()) {
                response(["message" => "Este e-mail já está em uso."], 409);
            }
        }

        $phone = $this->optionalString($this->inputValue($data, $personalGroups, "phone", $user["phone"]));
        $city = $this->optionalString($this->inputValue($data, $personalGroups, "city", $user["city"]));
        $state = $this->optionalString($this->inputValue($data, $personalGroups, "state", $user["state"]));
        $birthDate = $this->birthDate(
            $this->inputValue($data, $personalGroups, "birth_date",
                $this->inputValue($data, $personalGroups, "birthDate", $user["birth_date"]))
        );
        $desiredRole = $this->optionalString(
            $this->inputValue($data, $professionalGroups, "desired_role",
                $this->inputValue($data, $professionalGroups, "desiredRole", $user["desired_role"]))
        );

        $workModel = $this->inputValue($data, $professionalGroups, "work_model",
            $this->inputValue($data, $professionalGroups, "workModel", $user["work_model"]));
        $contractType = $this->inputValue($data, $professionalGroups, "contract_type",
            $this->inputValue($data, $professionalGroups, "contractType", $user["contract_type"]));
        $availability = $this->inputValue($data, $professionalGroups, "availability", $user["availability"]);
        $validValues = [
            "work_model" => ["Remoto", "Híbrido", "Presencial"],
            "contract_type" => ["CLT", "PJ", "CLT ou PJ"],
            "availability" => ["Imediata", "15 dias", "30 dias", "A combinar"],
        ];
        foreach (["work_model" => &$workModel, "contract_type" => &$contractType, "availability" => &$availability] as $field => &$value) {
            if ($value === "") {
                $value = null;
            } elseif ($value !== null && !in_array($value, $validValues[$field], true)) {
                response(["message" => "Valor inválido para {$field}."], 422);
            }
        }
        unset($value);

        $skills = $this->inputValue($data, $professionalGroups, "skills", $user["skills"]);
        if (is_string($skills)) {
            $decodedSkills = json_decode($skills, true);
            $skills = is_array($decodedSkills)
                ? $decodedSkills
                : array_values(array_filter(array_map("trim", explode(",", $skills))));
        }
        if ($skills === null || $skills === "") {
            $skills = [];
        }
        if (!is_array($skills)) {
            response(["message" => "O campo skills deve ser uma lista."], 422);
        }
        $skillsJson = json_encode(array_values($skills), JSON_UNESCAPED_UNICODE);

        $allowRecruiters = $this->inputValue($data, $privacyGroups, "allow_recruiters", $user["allow_recruiters"]);
        $emailRecommendations = $this->inputValue($data, $privacyGroups, "email_recommendations", $user["email_recommendations"]);
        $allowRecruiters = filter_var($allowRecruiters, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        $emailRecommendations = filter_var($emailRecommendations, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

        $stmt = $db->prepare(
            "UPDATE users SET name = :name, email = :email, phone = :phone, city = :city,
             state = :state, birth_date = :birth_date, desired_role = :desired_role,
             work_model = :work_model, contract_type = :contract_type,
             availability = :availability, skills = :skills,
             allow_recruiters = :allow_recruiters,
             email_recommendations = :email_recommendations, updated_at = NOW()
             WHERE id = :id AND deleted_at IS NULL"
        );
        $stmt->execute([
            ":name" => $name,
            ":email" => $email,
            ":phone" => $phone,
            ":city" => $city,
            ":state" => $state,
            ":birth_date" => $birthDate,
            ":desired_role" => $desiredRole,
            ":work_model" => $workModel,
            ":contract_type" => $contractType,
            ":availability" => $availability,
            ":skills" => $skillsJson,
            ":allow_recruiters" => $allowRecruiters,
            ":email_recommendations" => $emailRecommendations,
            ":id" => $id,
        ]);

        response([
            "success" => true,
            "message" => "Perfil atualizado com sucesso.",
            "data" => $this->profileData($this->findUser($id)),
        ]);
    }

    public function uploadAvatar()
    {
        $id = $this->currentUserId();
        $user = $this->findUser($id);
        $file = $_FILES["avatar"] ?? null;
        if (!$file || $file["error"] !== UPLOAD_ERR_OK || $file["size"] > 3 * 1024 * 1024) {
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
        $filename = $id . "_" . bin2hex(random_bytes(12)) . "." . $extensions[$mime];
        if (!move_uploaded_file($file["tmp_name"], $directory . "/" . $filename)) {
            throw new \RuntimeException("Não foi possível salvar o avatar enviado.");
        }

        $avatarUrl = "/api/uploads/avatars/" . $filename;
        $stmt = \getDB()->prepare(
            "UPDATE users SET avatar_url = :avatar_url, updated_at = NOW() WHERE id = :id"
        );
        $stmt->execute([":avatar_url" => $avatarUrl, ":id" => $id]);

        if ($user["avatar_url"] && strpos($user["avatar_url"], "/api/uploads/avatars/") === 0) {
            $oldFile = dirname(__DIR__) . substr($user["avatar_url"], strlen("/api"));
            if (is_file($oldFile)) {
                unlink($oldFile);
            }
        }

        $updated = $this->findUser($id);
        response([
            "success" => true,
            "message" => "Foto de perfil atualizada.",
            "avatar_url" => $avatarUrl,
            "data" => $this->profileData($updated),
        ]);
    }

    public function deleteAccount()
    {
        $id = $this->currentUserId();
        $stmt = \getDB()->prepare(
            "UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = :id AND deleted_at IS NULL"
        );
        $stmt->execute([":id" => $id]);
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