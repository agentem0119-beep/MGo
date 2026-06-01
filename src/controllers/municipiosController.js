const pool = require('../config/db');

const listarPorProvincia = async (req, res) => {
  const { provincia_id } = req.query;

  try {
    const resultado = await pool.query(
      'SELECT * FROM municipios WHERE provincia_id = $1 ORDER BY nome ASC',
      [provincia_id]
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar municípios' });
  }
};

module.exports = { listarPorProvincia };