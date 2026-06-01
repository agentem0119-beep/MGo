const express = require('express');
const router = express.Router();
const { listarCategorias } = require('../controllers/categoriasController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, listarCategorias);

module.exports = router;