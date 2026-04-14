import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const Private = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#6366f1', fontSize:'1.1rem' }}>Cargando...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const Public = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
};

export default function App() {
  const fetchMe = useAuthStore(s => s.fetchMe);
  const loading = useAuthStore(s => s.loading);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      fetchMe();
    } else {
      useAuthStore.setState({ loading: false });
    }
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#6366f1', fontSize:'1.1rem' }}>
      Cargando...
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Public><Login /></Public>} />
        <Route path="/register" element={<Public><Register /></Public>} />
        <Route path="/"         element={<Private><Dashboard /></Private>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}