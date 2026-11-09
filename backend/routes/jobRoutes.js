import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

function getFallbackJobs() {
  try {
    const vagasPath = path.join(__dirname, '../../public/vagas.json');
    if (fs.existsSync(vagasPath)) {
      const content = fs.readFileSync(vagasPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // ignore
  }
  return [];
}

// GET /api/jobs
router.get('/jobs', async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
    return res.status(200).json(jobs);
  } catch {
    return res.status(200).json(getFallbackJobs());
  }
});

// GET /api/github-jobs
router.get('/github-jobs', async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM github_jobs ORDER BY posted_at DESC');

    const formattedJobs = jobs.map((job) => {
      let skills = job.skills;
      if (typeof skills === 'string') {
        try {
          skills = JSON.parse(skills);
        } catch {
          skills = [];
        }
      }
      return {
        ...job,
        skills: Array.isArray(skills) ? skills : []
      };
    });

    return res.status(200).json({ jobs: formattedJobs });
  } catch {
    return res.status(200).json({ jobs: getFallbackJobs() });
  }
});

// GET /api/github-jobs/:id
router.get('/github-jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM github_jobs WHERE id = ? OR external_id = ? LIMIT 1',
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vaga do GitHub não encontrada' });
    }

    const job = rows[0];
    if (typeof job.skills === 'string') {
      try {
        job.skills = JSON.parse(job.skills);
      } catch {
        job.skills = [];
      }
    }

    return res.status(200).json({ job });
  } catch {
    const fallback = getFallbackJobs().find((j) => String(j.id) === String(id));
    if (fallback) return res.status(200).json({ job: fallback });
    return res.status(404).json({ error: 'Vaga não encontrada' });
  }
});

export default router;
