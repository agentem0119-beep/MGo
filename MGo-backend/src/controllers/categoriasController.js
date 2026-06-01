const pool = require('../config/db');

const listarCategorias = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM categorias ORDER BY nome ASC'
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
};

module.exports = { listarCategorias };