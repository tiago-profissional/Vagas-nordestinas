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
