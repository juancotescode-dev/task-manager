import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import api from '../api/axios';
import styles from './TaskModal.module.css';

export default function TaskModal({ task, onClose }) {
  const { createTask, updateTask } = useTaskStore();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    status: 'pending', due_date: '', category_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        category_id: task.category_id || '',
      });
    }
  }, [task]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, due_date: form.due_date || null, category_id: form.category_id || null };
      if (task) await updateTask(task.id, payload);
      else await createTask(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handle} className={styles.form}>
          <label>Título *</label>
          <input
            type="text" required placeholder="Título de la tarea"
            value={form.title} onChange={e => set('title', e.target.value)}
            className={styles.input}
          />

          <label>Descripción</label>
          <textarea
            placeholder="Descripción opcional..."
            value={form.description} onChange={e => set('description', e.target.value)}
            className={styles.textarea} rows={3}
          />

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Prioridad</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className={styles.select}>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className={styles.select}>
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Fecha límite</label>
              <input
                type="date" value={form.due_date}
                onChange={e => set('due_date', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label>Categoría</label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className={styles.select}>
                <option value="">Sin categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              {loading ? 'Guardando...' : task ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}