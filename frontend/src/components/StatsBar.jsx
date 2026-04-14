import styles from './StatsBar.module.css';

const statConfig = [
  { key: 'total',       label: 'Total',       color: '#6366f1' },
  { key: 'pending',     label: 'Pendientes',  color: '#f59e0b' },
  { key: 'in_progress', label: 'En progreso', color: '#3b82f6' },
  { key: 'completed',   label: 'Completadas', color: '#10b981' },
  { key: 'cancelled',   label: 'Canceladas',  color: '#94a3b8' },
  { key: 'urgent_pending', label: 'Urgentes', color: '#ef4444' },
];

export default function StatsBar({ stats }) {
  return (
    <div className={styles.bar}>
      {statConfig.map(({ key, label, color }) => (
        <div key={key} className={styles.card}>
          <span className={styles.number} style={{ color }}>{stats[key] ?? 0}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}