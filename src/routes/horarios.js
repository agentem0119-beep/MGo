const express = require('express');
const router = express.Router();
const { listarPorPosto } = require('../controllers/horariosController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, listarPorPosto);

module.exports = router;