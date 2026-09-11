<?php
// api/github_jobs_local.php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/config/database.php";

try {
    $pdo = getDB();

    $url = "https://api.github.com/repos/backend-br/vagas/issues?state=open&per_page=50";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "User-Agent: VagasNordestinasBot",
            "Accept: application/vnd.github+json"
        ],
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($ch);

    if ($response === false) {
        throw new Exception("Erro no cURL: " . curl_error($ch));
    }

    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($statusCode < 200 || $statusCode >= 300) {
        throw new Exception("GitHub respondeu com status HTTP " . $statusCode);
    }

    $issues = json_decode($response, true);

    if (!is_array($issues)) {
        throw new Exception("Resposta inválida do GitHub");
    }

    $inserted = 0;
    $updated = 0;

    $sql = "
        INSERT INTO github_jobs
        (
            external_id,
            title,
            url,
            skills,
            work_model,
            seniority,
            posted_by,
            posted_at,
            description,
            collected_at
        )
        VALUES
        (
            :external_id,
            :title,
            :url,
            :skills,
            :work_model,
            :seniority,
            :posted_by,
            :posted_at,
            :description,
            NOW()
        )
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            url = VALUES(url),
            skills = VALUES(skills),
            work_model = VALUES(work_model),
            seniority = VALUES(seniority),
            posted_by = VALUES(posted_by),
            posted_at = VALUES(posted_at),
            description = VALUES(description),
            collected_at = NOW()
    ";

    $stmt = $pdo->prepare($sql);

    foreach ($issues as $issue) {
        if (isset($issue["pull_request"])) {
            continue;
        }

        $labels = $issue["labels"] ?? [];

        $skills = [];
        $workModel = "Não informado";
        $seniority = "Não informado";

        foreach ($labels as $label) {
            $labelName = $label["name"] ?? "";

            if (stripos($labelName, "remoto") !== false) {
                $workModel = "Remoto";
            }

            if (stripos($labelName, "híbrido") !== false || stripos($labelName, "hibrido") !== false) {
                $workModel = "Híbrido";
            }

            if (stripos($labelName, "presencial") !== false) {
                $workModel = "Presencial";
            }

            if (
                stripos($labelName, "júnior") !== false ||
                stripos($labelName, "junior") !== false
            ) {
                $seniority = "Júnior";
            }

            if (stripos($labelName, "pleno") !== false) {
                $seniority = "Pleno";
            }

            if (
                stripos($labelName, "sênior") !== false ||
                stripos($labelName, "senior") !== false
            ) {
                $seniority = "Sênior";
            }

            $possibleSkills = [
                "PHP", "Python", "JavaScript", "TypeScript", "Node.js",
                "React", "Laravel", "Java", "C#", ".NET", "Ruby",
                "Go", "Rust", "Kotlin", "MySQL", "PostgreSQL",
                "Docker", "AWS", "Git", "SQL"
            ];

            foreach ($possibleSkills as $skill) {
                if (stripos($labelName, $skill) !== false) {
                    $skills[] = $skill;
                }
            }
        }

        $body = $issue["body"] ?? "";

        if ($workModel === "Não informado") {
            if (stripos($body, "100% remoto") !== false || stripos($body, "remoto") !== false) {
                $workModel = "Remoto";
            }
        }

        if ($seniority === "Não informado") {
            if (stripos($body, "júnior") !== false || stripos($body, "junior") !== false) {
                $seniority = "Júnior";
            } elseif (stripos($body, "pleno") !== false) {
                $seniority = "Pleno";
            } elseif (stripos($body, "sênior") !== false || stripos($body, "senior") !== false) {
                $seniority = "Sênior";
            }
        }

        $stmt->execute([
            ":external_id" => $issue["number"],
            ":title" => $issue["title"] ?? "Sem título",
            ":url" => $issue["html_url"] ?? "",
            ":skills" => json_encode(array_values(array_unique($skills)), JSON_UNESCAPED_UNICODE),
            ":work_model" => $workModel,
            ":seniority" => $seniority,
            ":posted_by" => $issue["user"]["login"] ?? "GitHub",
            ":posted_at" => isset($issue["created_at"])
                ? date("Y-m-d H:i:s", strtotime($issue["created_at"]))
                : null,
            ":description" => $body
        ]);

        if ($stmt->rowCount() === 1) {
            $inserted++;
        } else {
            $updated++;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Vagas do GitHub coletadas com sucesso.",
        "inserted" => $inserted,
        "updated" => $updated,
        "total_received" => count($issues)
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Erro ao coletar vagas do GitHub",
        "details" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}