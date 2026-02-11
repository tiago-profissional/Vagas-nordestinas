<?php

   require_once __DIR__ . "/config/headers.php";

   $file = __DIR__ . "/data/jobs.json";

   $jobs = json_decode(file_get_contents($file), true) ?? [];

   $method = $_SERVER["REQUEST_METHOD"];

   if($method !== "GET"){
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit;
   }

   if (isset($_GET["id"])){
    $id = (int) $_GET["id"];

        foreach($jobs as $job){
            if ((int)$job["id"] === $id){
                echo json_decode([
                    "success" => true,
                    "data" => $job
                ]);
                exit;
            }
        }

        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Job not found"
        ]);
        exit;
   }

   //Devuelve todas lass vancantes en formato JSON.

   echo json_encode([
    "success" => true,
    "data" => $jobs
   ]);
   exit;
