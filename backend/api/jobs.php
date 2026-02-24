<?php
  require_once __DIR__ . "/config/headers.php";
  $file = __DIR__ . "/data/jobs.json";

  // Lee el archivo (si no existe o está vacío, usa [])
  $jobs = [];
  if (file_exists($file)) {
    $jobs = json_decode(file_get_contents($file), true) ?? [];
  }
  if (!is_array($jobs)) $jobs = [];

  $method = $_SERVER["REQUEST_METHOD"];

  // ✅ CORS preflight (muy común cuando React llama a tu API)
  if ($method === "OPTIONS") {
    http_response_code(204);
    exit;
  }

// Helper: guardar JSON bonito
function saveJobs($file, $jobs) {
  file_put_contents($file, json_encode($jobs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Helper: validar campos mínimos
function validateJob($data) {
  $required = ["title", "company", "work_mode", "employment_type"];
  $missing = [];

  foreach ($required as $k) {
    if (!isset($data[$k]) || trim((string)$data[$k]) === "") {
      $missing[] = $k;
    }
  }

  if (count($missing) > 0) {
    return "Faltan campos obligatorios: " . implode(", ", $missing);
  }

  return null;
}

// Helper: obtener ID (acepta ?id= y también /jobs.php/123 si algún día usas rewrite)
function getIdFromRequest() {
  if (isset($_GET["id"])) return (int)$_GET["id"];

  $uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
  $parts = array_values(array_filter(explode("/", $uri)));
  $last = end($parts);

  if (is_numeric($last)) return (int)$last;
  return null;
}

/* =========================
   ✅ GET
   - GET /jobs.php         -> lista
   - GET /jobs.php?id=123  -> detalle
   ========================= */
if ($method === "GET") {
  $id = getIdFromRequest();

  if ($id !== null) {
    foreach ($jobs as $job) {
      if ((int)($job["id"] ?? 0) === $id) {
        echo json_encode(["success" => true, "data" => $job]);
        exit;
      }
    }

    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Job not found"]);
    exit;
  }

  echo json_encode(["success" => true, "data" => $jobs]);
  exit;
}

/* =========================
   ✅ POST /jobs.php
   Crea un nuevo job
   ========================= */
if ($method === "POST") {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);

  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
  }

  $err = validateJob($data);
  if ($err) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $err]);
    exit;
  }

  // genera id nuevo (max + 1)
  $maxId = 0;
  foreach ($jobs as $j) {
    $jid = (int)($j["id"] ?? 0);
    if ($jid > $maxId) $maxId = $jid;
  }
  $newId = $maxId + 1;

  $newJob = [
    "id" => $newId,
    "title" => $data["title"],
    "company" => $data["company"],
    "city" => $data["city"] ?? "",
    "state" => $data["state"] ?? "",
    "work_mode" => $data["work_mode"],
    "employment_type" => $data["employment_type"],
    "seniority" => $data["seniority"] ?? "junior",
    "salary_min" => $data["salary_min"] ?? null,
    "salary_max" => $data["salary_max"] ?? null,
    "currency" => $data["currency"] ?? "BRL",
    "description" => $data["description"] ?? ""
  ];

  $jobs[] = $newJob;
  saveJobs($file, $jobs);

  http_response_code(201);
  echo json_encode(["success" => true, "data" => $newJob]);
  exit;
}

/* =========================
   ✅ PUT /jobs.php?id=123
   Actualiza un job existente
   ========================= */
if ($method === "PUT") {
  $id = getIdFromRequest();
  if ($id === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Falta el id (?id=123)"]);
    exit;
  }

  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);

  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
  }

  $index = -1;
  foreach ($jobs as $i => $job) {
    if ((int)($job["id"] ?? 0) === $id) {
      $index = $i;
      break;
    }
  }

  if ($index === -1) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Job not found"]);
    exit;
  }

  // actualiza solo lo que venga
  $jobs[$index] = array_merge($jobs[$index], $data);
  $jobs[$index]["id"] = $id; // asegura que el id no cambie

  saveJobs($file, $jobs);
  echo json_encode(["success" => true, "data" => $jobs[$index]]);
  exit;
}

/* =========================
   ✅ DELETE /jobs.php?id=123
   Elimina un job
   ========================= */
if ($method === "DELETE") {
  $id = getIdFromRequest();
  if ($id === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Falta el id (?id=123)"]);
    exit;
  }

  $found = false;
  $new = [];

  foreach ($jobs as $job) {
    if ((int)($job["id"] ?? 0) === $id) {
      $found = true;
      continue;
    }
    $new[] = $job;
  }

  if (!$found) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Job not found"]);
    exit;
  }

  $jobs = $new;
  saveJobs($file, $jobs);

  echo json_encode(["success" => true, "message" => "Deleted"]);
  exit;
}

// Si llega aquí: método no soportado
http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);