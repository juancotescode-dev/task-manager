import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Task Manager</h1>
        <p className={styles.subtitle}>Crea tu cuenta</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handle} className={styles.form}>
          <input
            type="text" placeholder="Nombre completo" required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className={styles.input}
          />
          <input
            type="email" placeholder="Email" required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className={styles.input}
          />
          <input
            type="password" placeholder="Contraseña" required minLength={6}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Cargando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className={styles.link}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}