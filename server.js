require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const categoriasRoutes = require('./src/routes/categorias');
const servicosRoutes = require('./src/routes/servicos');
const postosRoutes = require('./src/routes/postos');
const provinciasRoutes = require('./src/routes/provincias');
const municipiosRoutes = require('./src/routes/municipios');
const horariosRoutes = require('./src/routes/horarios');
const marcacoesRoutes = require('./src/routes/marcacoes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/postos', postosRoutes);
app.use('/api/provincias', provinciasRoutes);
app.use('/api/municipios', municipiosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/marcacoes', marcacoesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor MGo a correr na porta ${PORT}`);
});