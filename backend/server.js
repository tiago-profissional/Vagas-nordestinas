import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { initDatabase } from './config/database.js';
import { readLocalDb } from './config/localDb.js';
import { calculateCompletionPercentage } from './services/profileService.js';

dotenv.config();

// Inicializa banco de dados e tabelas
initDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://vagasnordestinas.com',
  'https://www.vagasnordestinas.com'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (Uploads de Avatares)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Compatibilidade com chamadas legadas que usam /api/index.php?route=/...
app.use((req, res, next) => {
  if ((req.path === '/api/index.php' || req.path === '/index.php') && req.query.route) {
    const targetRoute = String(req.query.route).startsWith('/')
      ? req.query.route
      : `/${req.query.route}`;
    req.url = `/api${targetRoute}`;
  }
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online', service: 'Vagas Nordestinas Node.js Backend API' });
});

// Painel Visualizador do Banco de Dados no Navegador
const renderDbViewer = (req, res) => {
  const db = readLocalDb();
  const rowsHtml = (db.users || [])
    .map((u) => {
      const pct = calculateCompletionPercentage(u);
      const skillsBadges = (Array.isArray(u.skills) ? u.skills : [])
        .map((s) => `<span class="badge">${s}</span>`)
        .join(' ');
      return `
        <tr>
          <td><strong>#${u.id}</strong></td>
          <td>${u.name || '-'}</td>
          <td>${u.email || '-'}</td>
          <td>${u.phone || '-'}</td>
          <td>${u.city || '-'} / ${u.state || '-'}</td>
          <td>${u.desired_role || '-'}</td>
          <td>${u.work_model || '-'} (${u.contract_type || '-'})</td>
          <td>${skillsBadges || '-'}</td>
          <td><strong style="color:#d86b09">${pct}%</strong></td>
          <td>${u.deleted_at ? '<span style="color:red">Inativo</span>' : '<span style="color:green">Ativo</span>'}</td>
          <td>${u.updated_at ? new Date(u.updated_at).toLocaleString('pt-BR') : '-'}</td>
        </tr>
      `;
    })
    .join('');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Visualizador do Banco de Dados - Vagas Nordestinas</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #fff8f0; color: #191815; padding: 30px; margin: 0; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eadcca; padding-bottom: 15px; }
        h1 { color: #7e4220; margin: 0; font-size: 24px; }
        .btn { background: #d86b09; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; font-size: 14px; }
        .card { background: #fffdf9; border: 1px solid #eadcca; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); margin-bottom: 25px; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #eee2d3; }
        th { background: #fdf3e7; color: #7e4220; font-weight: 700; }
        .badge { display: inline-block; background: #ffedbc; color: #8b5a1e; padding: 3px 8px; border-radius: 99px; font-size: 11px; margin: 2px; font-weight: 600; }
        pre { background: #262320; color: #f8d276; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>🗄️ Visualizador do Banco de Dados (vagas_nordestinas)</h1>
            <p style="margin: 5px 0 0; color: #756454; font-size: 14px;">Tabela: <code>users</code> — Dados sincronizados em tempo real</p>
          </div>
          <button class="btn" onclick="location.reload()">🔄 Atualizar Tabela</button>
        </div>

        <div class="card">
          <h3 style="margin-top:0">Registros da Tabela <code>users</code></h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Cidade / UF</th>
                <th>Cargo Desejado</th>
                <th>Modelo / Contrato</th>
                <th>Habilidades</th>
                <th>Conclusão</th>
                <th>Status</th>
                <th>Última Atualização</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3 style="margin-top:0">📄 Dados Brutos (JSON no Banco)</h3>
          <pre>${JSON.stringify(db, null, 2)}</pre>
        </div>
      </div>
    </body>
    </html>
  `);
};

app.get('/db', renderDbViewer);
app.get('/api/db', renderDbViewer);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', jobRoutes);

// Suporte para aliases sem prefixo /api
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Tratamento de Rota Não Encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada.',
    path: req.originalUrl,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno no servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Node.js rodando com sucesso na porta ${PORT}`);
  console.log(`📍 Endpoint de Perfil: http://localhost:${PORT}/api/users/profile`);
  console.log(`🗄️ Visualizador do Banco: http://localhost:${PORT}/db`);
});

export default app;
