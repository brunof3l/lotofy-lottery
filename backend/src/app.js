const express = require('express');
const cors = require('cors');
const rateLimit = require('../utils/rateLimit');
const concursosRoutes = require('./routes/concursos');
const estatisticasRoutes = require('./routes/estatisticas');
const geradorRoutes = require('./routes/gerador');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimit);

app.use('/api/concursos', concursosRoutes);
app.use('/api/estatisticas', estatisticasRoutes);
app.use('/api/gerador', geradorRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => res.send('Lotofácil SaaS API'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
