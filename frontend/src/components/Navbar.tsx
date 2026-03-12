import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate('/')}>
        🗳️ Campaign Tweet
      </div>
      <div style={styles.links}>
        {token && role === 'admin' && (
          <button style={styles.btn} onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </button>
        )}
        {token && role === 'user' && (
          <button style={styles.btn} onClick={() => navigate('/posts')}>
            Posts
          </button>
        )}
        {token ? (
          <button style={{ ...styles.btn, ...styles.logout }} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button style={styles.btn} onClick={() => navigate('/login')}>Login</button>
            <button style={styles.btn} onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 24px', height: '60px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  brand: {
    color: '#fff', fontSize: '1.3rem', fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.5px',
  },
  links: { display: 'flex', gap: '10px' },
  btn: {
    background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
    padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  logout: { background: 'rgba(220,53,69,0.3)', borderColor: 'rgba(220,53,69,0.5)' },
};
