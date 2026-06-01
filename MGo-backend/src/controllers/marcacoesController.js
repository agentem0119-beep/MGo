const pool = require('../config/db');

const listarPorUtilizador = async (req, res) => {
  const { id } = req.utilizador;

  try {
    const resultado = await pool.query(
      `SELECT m.*, p.nome AS posto_nome
       FROM marcacoes m
       JOIN postos p ON m.posto_id = p.id
       WHERE m.utilizador_id = $1
       ORDER BY m.created_at DESC`,
      [id]
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao buscar marcações' });
  }
};

const criarMarcacao = async (req, res) => {
  const { id } = req.utilizador;
  const { posto_id, data_marcacao, hora_marcacao } = req.body;

  if (!posto_id || !data_marcacao || !hora_marcacao) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO marcacoes (utilizador_id, posto_id, data_marcacao, hora_marcacao, estado)
       VALUES ($1, $2, $3, $4, 'pendente')
       RETURNING *`,
      [id, posto_id, data_marcacao, hora_marcacao]
    );
    return res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao criar marcação' });
  }
};


const cancelarMarcacao = async (req, res) => {
  const { id } = req.params;
  const { id: utilizador_id } = req.utilizador;

  try {
    const resultado = await pool.query(
      `UPDATE marcacoes SET estado = 'cancelada'
       WHERE id = $1 AND utilizador_id = $2
       RETURNING *`,
      [id, utilizador_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Marcação não encontrada' });
    }

    return res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao cancelar marcação' });
  }
};

module.exports = { listarPorUtilizador, criarMarcacao, cancelarMarcacao };