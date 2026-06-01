const express = require('express');
const router = express.Router();
const { login, registar, atualizarPerfil, alterarSenha } = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.post('/login', login);
router.post('/registar', registar);
router.put('/perfil', authMiddleware, atualizarPerfil);
router.put('/senha', authMiddleware, alterarSenha);

module.exports = router;