<?php

namespace Controllers;

class GithubJobController
{
    public function index($params = [])
    {
        try {
            $pdo = getDB();

            $stmt = $pdo->query(
                "SELECT * FROM github_jobs ORDER BY posted_at DESC"
            );

            $jobs = $stmt->fetchAll();

            foreach ($jobs as &$job) {
                $job["skills"] =
                    json_decode($job["skills"] ?? "[]", true) ?: [];
            }

            response([
                "jobs" => $jobs
            ], 200);
        } catch (\Throwable $e) {
            response([
                "error" => "Erro ao buscar vagas do GitHub",
                "details" => $e->getMessage()
            ], 500);
        }
    }

    public function show($params = [])
    {
        try {
            $id = $params["id"] ?? null;

            if (!$id) {
                response(["error" => "ID não informado"], 400);
            }

            $pdo = getDB();

            $stmt = $pdo->prepare(
                "SELECT * FROM github_jobs
                 WHERE id = :id OR external_id = :external_id
                 LIMIT 1"
            );

            $stmt->execute([
                ":id" => $id,
                ":external_id" => $id
            ]);

            $job = $stmt->fetch();

            if (!$job) {
                response(["error" => "Vaga não encontrada"], 404);
            }

            $job["skills"] =
                json_decode($job["skills"] ?? "[]", true) ?: [];

            response([
                "job" => $job
            ], 200);
        } catch (\Throwable $e) {
            response([
                "error" => "Erro ao buscar vaga do GitHub",
                "details" => $e->getMessage()
            ], 500);
        }
    }
}