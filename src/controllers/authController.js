const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    const resultado = await pool.query(
      'SELECT * FROM utilizadores WHERE email = $1',
      [email]
    );

    const utilizador = resultado.rows[0];

    if (!utilizador) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(senha, utilizador.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: utilizador.id, email: utilizador.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      utilizador: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

const atualizarPerfil = async (req, res) => {
  const { id } = req.utilizador;
  const { nome, email, telefone } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  try {
    const resultado = await pool.query(
      `UPDATE utilizadores SET nome = $1, email = $2, telefone = $3
       WHERE id = $4 RETURNING id, nome, email, telefone, tipo`,
      [nome, email, telefone, id]
    );
    return res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
};

const alterarSenha = async (req, res) => {
  const { id } = req.utilizador;
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ erro: 'Preenche todos os campos' });
  }

  try {
    const resultado = await pool.query(
      'SELECT * FROM utilizadores WHERE id = $1', [id]
    );
    const utilizador = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(senhaAtual, utilizador.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha atual incorreta' });
    }

    const novaHash = await bcrypt.hash(novaSenha, 10);
    await pool.query(
      'UPDATE utilizadores SET senha = $1 WHERE id = $2',
      [novaHash, id]
    );

    return res.json({ mensagem: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao alterar senha' });
  }
};

const registar = async (req, res) => {
  const { nome, email, telefone, senha } = req.body; // 👈 adiciona telefone

  if (!nome || !email || !telefone || !senha) { // 👈 valida telefone
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
  }

  try {
    const existe = await pool.query(
      'SELECT id FROM utilizadores WHERE email = $1', [email]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ erro: 'Este email já está registado' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO utilizadores (nome, email, telefone, senha, tipo)
       VALUES ($1, $2, $3, $4, 'cidadao')
       RETURNING id, nome, email, telefone, tipo`, // 👈 adiciona telefone no INSERT
      [nome, email, telefone, hash]
    );

    const utilizador = resultado.rows[0];

    const token = jwt.sign(
      { id: utilizador.id, email: utilizador.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ token, utilizador });
  } catch (err) {
  console.error('Erro no registo:', err.message); // 👈
  return res.status(500).json({ erro: 'Erro ao criar conta' });
}
};

module.exports = { login, registar, atualizarPerfil, alterarSenha };