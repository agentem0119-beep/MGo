const pool = require('../config/db');

const listarProvincias = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM provincias ORDER BY nome ASC'
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar províncias' });
  }
};

module.exports = { listarProvincias };