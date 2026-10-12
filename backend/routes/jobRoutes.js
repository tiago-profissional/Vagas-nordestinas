import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

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
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar vagas do GitHub', details: error.message });
  }
});

// GET /api/github-jobs/:id
router.get('/github-jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar vaga', details: error.message });
  }
});

export default router;

