const pool = require('../config/db');

const listarPorPosto = async (req, res) => {
  const { posto_id } = req.query;

  try {
    const resultado = await pool.query(
      'SELECT * FROM horarios WHERE posto_id = $1 ORDER BY dia_semana ASC',
      [posto_id]
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar horários' });
  }
};

module.exports = { listarPorPosto };