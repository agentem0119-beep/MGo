const express = require('express');
const router = express.Router();
const { listarProvincias } = require('../controllers/provinciasController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, listarProvincias);

module.exports = router;