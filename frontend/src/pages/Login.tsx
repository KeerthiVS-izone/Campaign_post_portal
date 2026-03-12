import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formStyles as s } from './styles';
import type { AuthToken } from '../types';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const message = (location.state as any)?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      const data: AuthToken = res.data;
      authLogin(data.access_token, data.role, data.has_details);
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (!data.has_details) {
        navigate('/details');
      } else {
        navigate('/posts');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Welcome Back</h2>
        <p style={s.subtitle}>Login to your account</p>
        {message && <div style={s.success}>{message}</div>}
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Username</label>
            <input style={s.input} value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter username" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          <button style={s.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={s.link}>New user? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
