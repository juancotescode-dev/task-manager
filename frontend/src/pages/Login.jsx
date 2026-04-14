import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import styles from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas');
      setForm(f => ({ ...f, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Task Manager</h1>
        <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handle} className={styles.form}>
          <input
            type="email" placeholder="Email" required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className={styles.input}
          />
          <input
            type="password" placeholder="Contraseña" required
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className={styles.link}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}