const express = require('express');
const router = express.Router();
const { listarPorCategoria } = require('../controllers/servicosController');
const authMiddleware = require('../middlewares/auth');

router.get('/categoria/:id', authMiddleware, listarPorCategoria);

module.exports = router;