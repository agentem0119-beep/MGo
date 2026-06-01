const pool = require('../config/db');

const listarPorCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'SELECT * FROM servicos WHERE categoria_id = $1 ORDER BY nome ASC',
      [id]
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar serviços' });
  }
};

module.exports = { listarPorCategoria };