const express = require('express');
const router = express.Router();
const concursos = require('../../../amostras/concursos.json');

// GET /api/concursos/latest
router.get('/latest', async (req, res) => {
  const ultimo = concursos.reduce((a, b) => a.numeroDoConcurso > b.numeroDoConcurso ? a : b);
  res.json(ultimo);
});

// POST /api/concursos/sync
router.post('/sync', async (req, res) => {
  // Mock: apenas retorna sucesso
  res.json({ status: 'ok' });
});

// GET /api/concursos/:numero
router.get('/:numero', async (req, res) => {
  const numero = parseInt(req.params.numero);
  const concurso = concursos.find(c => c.numeroDoConcurso === numero);
  if (!concurso) return res.status(404).json({ error: 'Concurso não encontrado' });
  res.json(concurso);
});

// GET /api/concursos?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  const { from, to } = req.query;
  let result = concursos;
  if (from && to) {
    result = concursos.filter(c => c.dataApuracao >= from && c.dataApuracao <= to);
  }
  res.json(result);
});

module.exports = router;
