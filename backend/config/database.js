import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vagas_nordestinas',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

export async function initDatabase() {
  try {
    // Tenta criar o banco se não existir
    const tempConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 3306
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'vagas_nordestinas'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
    await tempConn.end();

<<<<<<< HEAD
    // Cria a tabela de usuários e perfil se não existir
=======
    // 1) Tabela de usuários e perfil
>>>>>>> tiago/tickets-node
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        city VARCHAR(100) DEFAULT NULL,
        state VARCHAR(100) DEFAULT NULL,
        birth_date DATE DEFAULT NULL,
        avatar_url VARCHAR(500) DEFAULT NULL,
        desired_role VARCHAR(255) DEFAULT NULL,
        work_model ENUM('Remoto', 'Híbrido', 'Presencial') DEFAULT 'Remoto',
        contract_type ENUM('CLT', 'PJ', 'CLT ou PJ') DEFAULT 'CLT ou PJ',
        availability ENUM('Imediata', '15 dias', '30 dias', 'A combinar') DEFAULT 'Imediata',
        skills LONGTEXT DEFAULT NULL,
        allow_recruiters TINYINT(1) NOT NULL DEFAULT 1,
        email_recommendations TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        deleted_at DATETIME DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

<<<<<<< HEAD
    console.log('✅ Banco de dados MySQL conectado e tabela "users" pronta para uso!');
=======
    // 2) Tabela de tokens para redefinição de senha (depende de users)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id INT(11) NOT NULL,
        token_hash CHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        used_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        PRIMARY KEY (id),
        UNIQUE KEY (token_hash),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ Banco de dados MySQL conectado e tabelas "users" e "password_resets" prontas!');
>>>>>>> tiago/tickets-node
  } catch (err) {
    console.warn('⚠️ [Aviso MySQL] Não foi possível conectar ao MySQL na porta 3306.');
    console.warn('   Motivo:', err.message);
    console.warn('   Certifique-se de ligar o MySQL (XAMPP ou Docker) para salvar os dados.');
  }
}

<<<<<<< HEAD
export default pool;
=======
export default pool;
>>>>>>> tiago/tickets-node
