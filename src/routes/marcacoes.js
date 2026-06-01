const express = require('express');
const router = express.Router();
const { listarPorUtilizador, criarMarcacao, cancelarMarcacao } = require('../controllers/marcacoesController');const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, listarPorUtilizador);
router.post('/', authMiddleware, criarMarcacao);
router.post('/:id/cancelar', authMiddleware, cancelarMarcacao);

module.exports = router;