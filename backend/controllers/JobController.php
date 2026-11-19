<?php
namespace Controllers;

class JobController
{
    private function jsonBody()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!is_array($data)) {
            response(["message" => "Corpo JSON inválido."], 400);
        }
        return $data;
    }

    private function jobById($id)
    {
        $stmt = \getDB()->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
        $stmt->execute([":id" => $id]);
        $job = $stmt->fetch();
        if (!$job) {
            response(["message" => "Vaga não encontrada."], 404);
        }
        return $job;
    }

    private function requireOwner(array $job, array $user)
    {
        if ((string) $job["user_id"] !== (string) $user["sub"] &&
            ($user["role"] ?? "user") !== "admin") {
            response(["message" => "Você não tem permissão para alterar esta vaga."], 403);
        }
    }

    private function validateJob(array $data)
    {
        foreach (["title", "company", "city", "state"] as $field) {
            if (!isset($data[$field]) || trim((string) $data[$field]) === "") {
                response(["message" => "Campo obrigatório: {$field}."], 422);
            }
        }
        if (isset($data["url"]) && $data["url"] !== "" &&
            !filter_var($data["url"], FILTER_VALIDATE_URL)) {
            response(["message" => "O link da vaga precisa ser uma URL válida."], 422);
        }
        foreach (["salary_min", "salary_max"] as $field) {
            if (isset($data[$field]) && $data[$field] !== "" &&
                (!is_numeric($data[$field]) || (float) $data[$field] < 0)) {
                response(["message" => "Valor inválido para {$field}."], 422);
            }
        }
    }

    public function index()
    {
        $stmt = \getDB()->query("SELECT * FROM jobs ORDER BY id DESC");
        response($stmt->fetchAll());
    }

    public function show($params)
    {
        response($this->jobById($params["id"] ?? null));
    }

    public function store()
    {
        $user = \JwtHelper::requireAuth();
        $data = $this->jsonBody();
        $this->validateJob($data);

        $stmt = \getDB()->prepare(
            "INSERT INTO jobs
             (title, company, city, state, work_mode, employment_type, salary_min,
              salary_max, currency, description, url, user_id)
             VALUES
             (:title, :company, :city, :state, :work_mode, :employment_type, :salary_min,
              :salary_max, 'BRL', :description, :url, :user_id)"
        );
        $stmt->execute([
            ":title" => trim($data["title"]),
            ":company" => trim($data["company"]),
            ":city" => trim($data["city"]),
            ":state" => trim($data["state"]),
            ":work_mode" => $data["work_mode"] ?? "remote",
            ":employment_type" => $data["employment_type"] ?? "full_time",
            ":salary_min" => $data["salary_min"] ?? null,
            ":salary_max" => $data["salary_max"] ?? null,
            ":description" => trim($data["description"] ?? ""),
            ":url" => $data["url"] ?? null,
            ":user_id" => $user["sub"],
        ]);
        response([
            "success" => true,
            "message" => "Vaga criada com sucesso.",
            "id" => (int) \getDB()->lastInsertId(),
        ], 201);
    }

    public function update($params)
    {
        $user = \JwtHelper::requireAuth();
        $job = $this->jobById($params["id"]);
        $this->requireOwner($job, $user);
        $data = $this->jsonBody();
        $this->validateJob($data);

        $stmt = \getDB()->prepare(
            "UPDATE jobs SET title = :title, company = :company, city = :city,
             state = :state, work_mode = :work_mode, employment_type = :employment_type,
             salary_min = :salary_min, salary_max = :salary_max, description = :description,
             url = :url, updated_at = NOW()
             WHERE id = :id"
        );
        $stmt->execute([
            ":title" => trim($data["title"]),
            ":company" => trim($data["company"]),
            ":city" => trim($data["city"]),
            ":state" => trim($data["state"]),
            ":work_mode" => $data["work_mode"] ?? "remote",
            ":employment_type" => $data["employment_type"] ?? null,
            ":salary_min" => $data["salary_min"] ?? null,
            ":salary_max" => $data["salary_max"] ?? null,
            ":description" => trim($data["description"] ?? ""),
            ":url" => array_key_exists("url", $data) ? $data["url"] : $job["url"],
            ":id" => $params["id"],
        ]);
        response(["success" => true, "message" => "Vaga atualizada com sucesso."]);
    }

    public function destroy($params)
    {
        $user = \JwtHelper::requireAuth();
        $job = $this->jobById($params["id"]);
        $this->requireOwner($job, $user);

        $stmt = \getDB()->prepare("DELETE FROM jobs WHERE id = :id");
        $stmt->execute([":id" => $params["id"]]);
        response(["success" => true, "message" => "Vaga excluída com sucesso."]);
    }

    public function apply($params)
    {
        $user = \JwtHelper::requireAuth();
        $job = $this->jobById($params["id"] ?? null);
        $db = \getDB();

        $stmt = $db->prepare(
            "SELECT id FROM candidaturas WHERE user_id = :user_id AND job_id = :job_id LIMIT 1"
        );
        $stmt->execute([":user_id" => $user["sub"], ":job_id" => $params["id"]]);
        if ($stmt->fetchColumn() !== false) {
            response(["message" => "Você já se candidatou a esta vaga."], 409);
        }

        try {
            $stmt = $db->prepare(
                "INSERT INTO candidaturas (user_id, job_id, status)
                 VALUES (:user_id, :job_id, 'Em análise')"
            );
            $stmt->execute([":user_id" => $user["sub"], ":job_id" => $params["id"]]);
        } catch (\PDOException $error) {
            if ($error->getCode() === "23000" && (int) ($error->errorInfo[1] ?? 0) === 1062) {
                response(["message" => "Você já se candidatou a esta vaga."], 409);
            }
            throw $error;
        }

        $applyUrl = $job["apply_url"] ?? null;
        if (!is_string($applyUrl) || trim($applyUrl) === "") {
            $applyUrl = null;
        }

        response([
            "success" => true,
            "message" => "Candidatura enviada com sucesso.",
            "apply_url" => $applyUrl,
        ], 201);
    }

    public function myApplications()
    {
        $user = \JwtHelper::requireAuth();
        $stmt = \getDB()->prepare(
            "SELECT c.id AS candidatura_id, c.status, c.created_at AS data_candidatura,
                    j.id AS job_id, j.title, j.company, j.city, j.state, j.work_mode
             FROM candidaturas c
             JOIN jobs j ON j.id = c.job_id
             WHERE c.user_id = :user_id
             ORDER BY c.created_at DESC"
        );
        $stmt->execute([":user_id" => $user["sub"]]);
        response(["success" => true, "data" => $stmt->fetchAll()]);
    }
}
