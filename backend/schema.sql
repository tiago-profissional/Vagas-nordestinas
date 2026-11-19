CREATE DATABASE IF NOT EXISTS `vagas_nordestinas`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE `vagas_nordestinas`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `birth_date` DATE DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `desired_role` VARCHAR(255) DEFAULT NULL,
  `work_model` ENUM('Remoto', 'Híbrido', 'Presencial') DEFAULT 'Remoto',
  `contract_type` ENUM('CLT', 'PJ', 'CLT ou PJ') DEFAULT 'CLT ou PJ',
  `availability` ENUM('Imediata', '15 dias', '30 dias', 'A combinar') DEFAULT 'Imediata',
  `skills` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
    CHECK (json_valid(`skills`)),
  `allow_recruiters` TINYINT(1) NOT NULL DEFAULT 1,
  `email_recommendations` TINYINT(1) NOT NULL DEFAULT 1,
  `role` ENUM('user', 'recruiter', 'admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token_hash` CHAR(64) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `password_resets_token_hash_unique` (`token_hash`),
  KEY `password_resets_user_id_idx` (`user_id`),
  CONSTRAINT `password_resets_user_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `company` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(10) NOT NULL,
  `work_mode` VARCHAR(20) NOT NULL,
  `employment_type` VARCHAR(30) DEFAULT NULL,
  `salary_min` INT DEFAULT NULL,
  `salary_max` INT DEFAULT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'BRL',
  `description` TEXT NOT NULL,
  `url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  `status` VARCHAR(50) DEFAULT 'Rascunho',
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `candidaturas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `job_id` INT UNSIGNED NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Em análise',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_candidatura` (`user_id`, `job_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_job_id` (`job_id`),
  CONSTRAINT `candidaturas_user_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `candidaturas_job_id_fk`
    FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Safe for existing installations on MySQL and MariaDB.
SET @profile_bio_users_sql = IF(
  EXISTS(
    SELECT 1 FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
  ) AND NOT EXISTS(
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'bio'
  ),
  'ALTER TABLE `users` ADD COLUMN `bio` TEXT NULL AFTER `state`',
  'SELECT 1'
);
PREPARE profile_bio_users_stmt FROM @profile_bio_users_sql;
EXECUTE profile_bio_users_stmt;
DEALLOCATE PREPARE profile_bio_users_stmt;

-- The Node backend uses this legacy table name in the same local database.
SET @profile_bio_usuarios_sql = IF(
  EXISTS(
    SELECT 1 FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios'
  ) AND NOT EXISTS(
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'bio'
  ),
  'ALTER TABLE `usuarios` ADD COLUMN `bio` TEXT NULL AFTER `state`',
  'SELECT 1'
);
PREPARE profile_bio_usuarios_stmt FROM @profile_bio_usuarios_sql;
EXECUTE profile_bio_usuarios_stmt;
DEALLOCATE PREPARE profile_bio_usuarios_stmt;
