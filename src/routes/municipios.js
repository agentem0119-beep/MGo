const express = require('express');
const router = express.Router();
const { listarPorProvincia } = require('../controllers/municipiosController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, listarPorProvincia);

module.exports = router;