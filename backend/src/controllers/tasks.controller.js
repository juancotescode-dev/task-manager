const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { status, priority, category_id, search, sort = 'created_at', order = 'DESC' } = req.query;
    let query = `SELECT t.*, c.name as category_name, c.color as category_color
                 FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
                 WHERE t.user_id = $1`;
    const params = [req.user.id];
    let i = 2;

    if (status)      { query += ` AND t.status = $${i++}`;      params.push(status); }
    if (priority)    { query += ` AND t.priority = $${i++}`;    params.push(priority); }
    if (category_id) { query += ` AND t.category_id = $${i++}`; params.push(category_id); }
    if (search)      { query += ` AND t.title ILIKE $${i++}`;   params.push(`%${search}%`); }

    const allowed = ['created_at', 'due_date', 'priority', 'title'];
    const col = allowed.includes(sort) ? sort : 'created_at';
    query += ` ORDER BY t.${col} ${order === 'ASC' ? 'ASC' : 'DESC'}`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='pending')     AS pending,
        COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status='completed')   AS completed,
        COUNT(*) FILTER (WHERE status='cancelled')   AS cancelled,
        COUNT(*) FILTER (WHERE priority='urgent' AND status != 'completed') AS urgent_pending,
        COUNT(*) AS total
      FROM tasks WHERE user_id=$1`, [req.user.id]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, description, priority = 'medium', due_date, category_id } = req.body;
    if (!title) return res.status(400).json({ error: 'El título es requerido' });

    const { rows } = await db.query(
      `INSERT INTO tasks(title,description,priority,due_date,category_id,user_id)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, priority, due_date || null, category_id || null, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['title', 'description', 'status', 'priority', 'due_date', 'category_id'];
    const updates = [], params = [];
    let i = 1;

    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        updates.push(`${f}=$${i++}`);
        params.push(req.body[f]);
      }
    });
    if (!updates.length) return res.status(400).json({ error: 'Nada que actualizar' });

    params.push(id, req.user.id);
    const { rows } = await db.query(
      `UPDATE tasks SET ${updates.join(',')} WHERE id=$${i} AND user_id=$${i+1} RETURNING *`,
      params
    );
    if (!rows.length) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};