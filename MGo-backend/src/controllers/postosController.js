const pool = require('../config/db');

const listarPorServico = async (req, res) => {
  const { servico_id } = req.query;

  try {
    const resultado = await pool.query(
      'SELECT * FROM postos WHERE servico_id = $1 ORDER BY nome ASC',
      [servico_id]
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar postos' });
  }
};

module.exports = { listarPorServico };