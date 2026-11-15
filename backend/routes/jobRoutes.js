import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/jobs
router.get('/jobs', async (req, res, next) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
    return res.status(200).json(jobs);
  } catch (error) {
    return next(error);
  }
});

router.get('/jobs/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(404).json({ error: 'Vaga não encontrada' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM jobs WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

export default router;
