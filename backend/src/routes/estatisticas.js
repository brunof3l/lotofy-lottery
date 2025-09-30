const express = require('express');
const router = express.Router();
const concursos = require('../../../amostras/concursos.json');

// GET /api/estatisticas/frequencia
router.get('/frequencia', async (req, res) => {
  const freq = Array(25).fill(0);
  concursos.forEach(c => {
    c.dezenas.forEach(d => {
      freq[d - 1]++;
    });
  });
  const result = freq.map((f, i) => ({ dezena: i + 1, frequencia: f }));
  res.json(result);
});

module.exports = router;
