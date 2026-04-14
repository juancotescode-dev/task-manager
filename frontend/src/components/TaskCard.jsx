import { useTaskStore } from '../store/taskStore';
import styles from './TaskCard.module.css';

const priorityLabel = { low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente' };
const statusLabel = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completada', cancelled: 'Cancelada' };
const priorityColor = { low: '#10b981', medium: '#f59e0b', high: '#f97316', urgent: '#ef4444' };
const statusColor   = { pending: '#f59e0b', in_progress: '#3b82f6', completed: '#10b981', cancelled: '#94a3b8' };

export default function TaskCard({ task, onEdit }) {
  const { updateTask, deleteTask } = useTaskStore();

  const toggleComplete = () => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed'
    });
  };

  return (
    <div className={`${styles.card} ${task.status === 'completed' ? styles.done : ''}`}>
      <div className={styles.top}>
        <div className={styles.badges}>
          <span className={styles.badge} style={{ background: priorityColor[task.priority] + '20', color: priorityColor[task.priority] }}>
            {priorityLabel[task.priority]}
          </span>
          <span className={styles.badge} style={{ background: statusColor[task.status] + '20', color: statusColor[task.status] }}>
            {statusLabel[task.status]}
          </span>
          {task.category_name && (
            <span className={styles.badge} style={{ background: (task.category_color || '#6366f1') + '20', color: task.category_color || '#6366f1' }}>
              {task.category_name}
            </span>
          )}
        </div>
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={toggleComplete}
          className={styles.check}
          title="Marcar como completada"
        />
      </div>

      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.desc}>{task.description}</p>}
      {task.due_date && (
        <p className={styles.due}>
          Vence: {new Date(task.due_date).toLocaleDateString('es-CO')}
        </p>
      )}

      <div className={styles.actions}>
        <button onClick={() => onEdit(task)} className={styles.editBtn}>Editar</button>
        <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn}>Eliminar</button>
      </div>
    </div>
  );
}