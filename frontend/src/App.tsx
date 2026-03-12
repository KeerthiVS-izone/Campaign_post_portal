import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import SubmitDetails from './pages/SubmitDetails';
import Posts from './pages/Posts';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && role !== 'admin') return <Navigate to="/posts" />;
  return <>{children}</>;
}

function UserRoute({ children }: { children: React.ReactNode }) {
  const { token, role, hasDetails } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" />;
  if (!hasDetails) return <Navigate to="/details" />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/details" element={<PrivateRoute><SubmitDetails /></PrivateRoute>} />
          <Route path="/posts" element={<UserRoute><Posts /></UserRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
