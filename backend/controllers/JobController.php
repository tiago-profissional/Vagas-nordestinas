<?php
// backend/controllers/JobController.php
namespace Controllers;

class JobController {
    
    private function getDB() {
        try {
            $pdo = new \PDO("mysql:host=localhost;dbname=vagas_nordestinas;charset=utf8", 'root', '');
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
            return $pdo;
        } catch(\PDOException $e) {
            response(['error' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }
    
    public function index() {
        $db = $this->getDB();
        $stmt = $db->query("SELECT * FROM jobs ORDER BY id DESC");
        $jobs = $stmt->fetchAll();
        response($jobs ?: []);
    }
    
    public function show($params) {
        // O parâmetro vem como 'id' do router
        $id = $params['id'] ?? null;
        
        if (!$id) {
            response(['error' => 'ID não fornecido'], 400);
        }
        
        error_log("Buscando vaga com ID: " . $id);
        
        $db = $this->getDB();
        $stmt = $db->prepare("SELECT * FROM jobs WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $job = $stmt->fetch();
        
        if (!$job) {
            response(['error' => 'Job not found with ID: ' . $id], 404);
        }
        
        response($job);
    }
    
    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $required = ['title', 'company', 'city', 'state'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                response(['error' => "Campo obrigatório: $field"], 422);
            }
        }
        
        $db = $this->getDB();
        $sql = "INSERT INTO jobs (title, company, city, state, work_mode, employment_type, salary_min, salary_max, description) 
                VALUES (:title, :company, :city, :state, :work_mode, :employment_type, :salary_min, :salary_max, :description)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':title' => $data['title'],
            ':company' => $data['company'],
            ':city' => $data['city'],
            ':state' => $data['state'],
            ':work_mode' => $data['work_mode'] ?? 'remote',
            ':employment_type' => $data['employment_type'] ?? 'full_time',
            ':salary_min' => $data['salary_min'] ?? null,
            ':salary_max' => $data['salary_max'] ?? null,
            ':description' => $data['description'] ?? ''
        ]);
        
        response([
            'success' => true, 
            'message' => 'Vaga criada com sucesso',
            'id' => $db->lastInsertId()
        ], 201);
    }
    
    public function update($params) {
        $id = $params['id'];
        $data = json_decode(file_get_contents('php://input'), true);
        
        $db = $this->getDB();
        $sql = "UPDATE jobs SET 
                title = :title,
                company = :company,
                city = :city,
                state = :state,
                work_mode = :work_mode,
                employment_type = :employment_type,
                salary_min = :salary_min,
                salary_max = :salary_max,
                description = :description
                WHERE id = :id";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':title' => $data['title'],
            ':company' => $data['company'],
            ':city' => $data['city'],
            ':state' => $data['state'],
            ':work_mode' => $data['work_mode'] ?? 'remote',
            ':employment_type' => $data['employment_type'] ?? 'full_time',
            ':salary_min' => $data['salary_min'] ?? null,
            ':salary_max' => $data['salary_max'] ?? null,
            ':description' => $data['description'] ?? '',
            ':id' => $id
        ]);
        
        response(['success' => true, 'message' => 'Vaga atualizada com sucesso']);
    }
    
    public function destroy($params) {
        $id = $params['id'];
        $db = $this->getDB();
        $stmt = $db->prepare("DELETE FROM jobs WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        response(['success' => true, 'message' => 'Vaga deletada com sucesso']);
    }
}