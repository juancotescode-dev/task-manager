import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import StatsBar from '../components/StatsBar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { tasks, stats, filters, loading, fetchTasks, fetchStats, setFilter } = useTaskStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const openEdit = (task) => { setEditing(task); setShowModal(true); };
  const closeModal = () => { setEditing(null); setShowModal(false); };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>Task Manager</h1>
          <span className={styles.welcome}>Hola, {user?.name} 👋</span>
        </div>
        <button onClick={logout} className={styles.logoutBtn}>Cerrar sesión</button>
      </header>

      <main className={styles.main}>
        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Filters + New Task */}
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filters.status}
              onChange={e => setFilter('status', e.target.value)}
              className={styles.select}
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
            <select
              value={filters.priority}
              onChange={e => setFilter('priority', e.target.value)}
              className={styles.select}
            >
              <option value="">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <button onClick={() => setShowModal(true)} className={styles.newBtn}>
            + Nueva tarea
          </button>
        </div>

        {/* Task list */}
        {loading ? (
          <p className={styles.empty}>Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className={styles.empty}>No hay tareas. ¡Crea una!</p>
        ) : (
          <div className={styles.grid}>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={openEdit} />
            ))}
          </div>
        )}
      </main>

      {showModal && <TaskModal task={editing} onClose={closeModal} />}
    </div>
  );
}