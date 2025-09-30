const express = require('express');
const router = express.Router();

// POST /api/user/history
router.post('/history', async (req, res) => {
  // ...armazenar geração no histórico do usuário...
});

// GET /api/user/history
router.get('/history', async (req, res) => {
  // ...retornar histórico do usuário...
});

module.exports = router;
