const express = require('express');
const router = express.Router();
const concursos = require('../../../amostras/concursos.json');

function gerarTopK(k = 15) {
  const freq = Array(25).fill(0);
  concursos.forEach(c => {
    c.dezenas.forEach(d => {
      freq[d - 1]++;
    });
  });
  const top = freq
    .map((f, i) => ({ dezena: i + 1, score: f }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(x => x.dezena);
  return top;
}

function gerarWeightedRandom(k = 15) {
  const freq = Array(25).fill(0);
  concursos.forEach(c => {
    c.dezenas.forEach(d => {
      freq[d - 1]++;
    });
  });
  // Weighted random: sorteia 15 dezenas proporcional à frequência
  const pool = [];
  freq.forEach((f, i) => {
    for (let j = 0; j < f; j++) pool.push(i + 1);
  });
  const set = new Set();
  while (set.size < k && pool.length > 0) {
    set.add(pool[Math.floor(Math.random() * pool.length)]);
  }
  return Array.from(set);
}

function gerarWindowedHot(k = 15, window = 3) {
  // Frequência nas últimas 'window' concursos
  const ultimos = concursos.slice(-window);
  const freq = Array(25).fill(0);
  ultimos.forEach(c => {
    c.dezenas.forEach(d => {
      freq[d - 1]++;
    });
  });
  const top = freq
    .map((f, i) => ({ dezena: i + 1, score: f }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(x => x.dezena);
  return top;
}

// GET /api/gerador?strategy=top-k&count=1
router.get('/', async (req, res) => {
  const { strategy = 'top-k', count = 1 } = req.query;
  let results = [];
  if (strategy === 'top-k') {
    for (let i = 0; i < count; i++) {
      results.push({ estrategia: 'top-k', numeros: gerarTopK(), meta: { regra: 'top 15 frequentes' } });
    }
  } else if (strategy === 'weighted-random') {
    for (let i = 0; i < count; i++) {
      results.push({ estrategia: 'weighted-random', numeros: gerarWeightedRandom(), meta: { regra: 'sorteio ponderado frequência' } });
    }
  } else if (strategy === 'windowed-hot') {
    for (let i = 0; i < count; i++) {
      results.push({ estrategia: 'windowed-hot', numeros: gerarWindowedHot(), meta: { regra: 'top 15 últimas 3 concursos' } });
    }
  }
  res.json(results);
});

module.exports = router;
