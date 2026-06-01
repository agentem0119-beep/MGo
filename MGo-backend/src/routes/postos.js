const express = require('express');
const router = express.Router();
const { listarPorServico } = require('../controllers/postosController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, listarPorServico);

module.exports = router;