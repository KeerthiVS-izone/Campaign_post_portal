import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage';
import PostsPage from './pages/PostsPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
