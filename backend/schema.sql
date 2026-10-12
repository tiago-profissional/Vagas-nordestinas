-- ========================================================
-- Schema MySQL para o Back-end Node.js - Vagas Nordestinas
-- Database: vagas_nordestinas
-- ========================================================

CREATE DATABASE IF NOT EXISTS `vagas_nordestinas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vagas_nordestinas`;

-- Tabela de Usuários e Perfil
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `birth_date` DATE DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `desired_role` VARCHAR(255) DEFAULT NULL,
  `work_model` ENUM('Remoto', 'Híbrido', 'Presencial') DEFAULT 'Remoto',
  `contract_type` ENUM('CLT', 'PJ', 'CLT ou PJ') DEFAULT 'CLT ou PJ',
  `availability` ENUM('Imediata', '15 dias', '30 dias', 'A combinar') DEFAULT 'Imediata',
  `skills` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `allow_recruiters` TINYINT(1) NOT NULL DEFAULT 1,
  `email_recommendations` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Migração para tabelas existentes
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `phone` VARCHAR(30) DEFAULT NULL AFTER `password`,
  ADD COLUMN IF NOT EXISTS `city` VARCHAR(100) DEFAULT NULL AFTER `phone`,
  ADD COLUMN IF NOT EXISTS `state` VARCHAR(100) DEFAULT NULL AFTER `city`,
  ADD COLUMN IF NOT EXISTS `birth_date` DATE DEFAULT NULL AFTER `state`,
  ADD COLUMN IF NOT EXISTS `avatar_url` VARCHAR(500) DEFAULT NULL AFTER `birth_date`,
  ADD COLUMN IF NOT EXISTS `desired_role` VARCHAR(255) DEFAULT NULL AFTER `avatar_url`,
  ADD COLUMN IF NOT EXISTS `work_model` ENUM('Remoto', 'Híbrido', 'Presencial') DEFAULT 'Remoto' AFTER `desired_role`,
  ADD COLUMN IF NOT EXISTS `contract_type` ENUM('CLT', 'PJ', 'CLT ou PJ') DEFAULT 'CLT ou PJ' AFTER `work_model`,
  ADD COLUMN IF NOT EXISTS `availability` ENUM('Imediata', '15 dias', '30 dias', 'A combinar') DEFAULT 'Imediata' AFTER `contract_type`,
  ADD COLUMN IF NOT EXISTS `skills` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL AFTER `availability`,
  ADD COLUMN IF NOT EXISTS `allow_recruiters` TINYINT(1) NOT NULL DEFAULT 1 AFTER `skills`,
  ADD COLUMN IF NOT EXISTS `email_recommendations` TINYINT(1) NOT NULL DEFAULT 1 AFTER `allow_recruiters`,
  ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() AFTER `created_at`,
  ADD COLUMN IF NOT EXISTS `deleted_at` DATETIME DEFAULT NULL AFTER `updated_at`;

