const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM categories WHERE user_id=$1 ORDER BY name', [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, color = '#6366f1' } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
    const { rows } = await db.query(
      'INSERT INTO categories(name,color,user_id) VALUES($1,$2,$3) RETURNING *',
      [name, color, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM categories WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};