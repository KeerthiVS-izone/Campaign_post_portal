import { useEffect, useState } from 'react';
import {
  getPosts, createPost, deletePost,
  getRetweets, createRetweet, deleteRetweet,
  getUploadedPosts, uploadExcel
} from '../services/api';
import type { Post, Retweet, UploadedPost } from '../types';

type Tab = 'posts' | 'retweets' | 'upload';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [retweets, setRetweets] = useState<Retweet[]>([]);
  const [uploadedPosts, setUploadedPosts] = useState<UploadedPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newRetweet, setNewRetweet] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const [p, r, u] = await Promise.all([getPosts(), getRetweets(), getUploadedPosts()]);
    setPosts(p.data);
    setRetweets(r.data);
    setUploadedPosts(u.data);
  };

  useEffect(() => { loadData(); }, []);

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };
  const showErr = (msg: string) => { setError(msg); setTimeout(() => setError(''), 4000); };

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    setLoading(true);
    try {
      await createPost(newPost.trim());
      setNewPost('');
      loadData();
      showMsg('Post added successfully!');
    } catch (e: any) {
      showErr(e.response?.data?.detail || 'Failed to add post');
    } finally { setLoading(false); }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await deletePost(id);
    loadData();
    showMsg('Post deleted');
  };

  const handleAddRetweet = async () => {
    if (!newRetweet.trim()) return;
    setLoading(true);
    try {
      await createRetweet(newRetweet.trim());
      setNewRetweet('');
      loadData();
      showMsg('Retweet content added!');
    } catch (e: any) {
      showErr(e.response?.data?.detail || 'Failed to add retweet');
    } finally { setLoading(false); }
  };

  const handleDeleteRetweet = async (id: number) => {
    if (!confirm('Delete this retweet?')) return;
    await deleteRetweet(id);
    loadData();
    showMsg('Retweet deleted');
  };

  const handleUpload = async () => {
    if (!file) return showErr('Please select an Excel file');
    setLoading(true);
    try {
      const res = await uploadExcel(file);
      setFile(null);
      loadData();
      showMsg(res.data.message);
    } catch (e: any) {
      showErr(e.response?.data?.detail || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛠️ Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage campaign content</p>
      </div>

      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.stats}>
        {[
          { label: 'Total Posts', value: posts.length, color: '#4caf50' },
          { label: 'Retweet Items', value: retweets.length, color: '#2196f3' },
          { label: 'Excel Uploads', value: uploadedPosts.length, color: '#ff9800' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.tabs}>
        {(['posts', 'retweets', 'upload'] as Tab[]).map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }}
            onClick={() => setTab(t)}>
            {t === 'posts' ? '📝 Posts' : t === 'retweets' ? '🔄 Retweets' : '📊 Excel Upload'}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div>
          <div style={styles.addSection}>
            <h3 style={styles.sectionTitle}>Add New Post</h3>
            <textarea style={styles.textarea} rows={4} value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Enter campaign post content..." />
            <button style={styles.addBtn} onClick={handleAddPost} disabled={loading}>
              {loading ? 'Adding...' : '+ Add Post'}
            </button>
          </div>
          <div style={styles.list}>
            {posts.map(p => (
              <div key={p.id} style={styles.item}>
                <p style={styles.itemContent}>{p.content}</p>
                <div style={styles.itemMeta}>
                  <span>By: {p.created_by}</span>
                  <button style={styles.deleteBtn} onClick={() => handleDeletePost(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'retweets' && (
        <div>
          <div style={styles.addSection}>
            <h3 style={styles.sectionTitle}>Add Retweet Content</h3>
            <textarea style={styles.textarea} rows={4} value={newRetweet}
              onChange={e => setNewRetweet(e.target.value)}
              placeholder="Enter retweet content..." />
            <button style={styles.addBtn} onClick={handleAddRetweet} disabled={loading}>
              {loading ? 'Adding...' : '+ Add Retweet'}
            </button>
          </div>
          <div style={styles.list}>
            {retweets.map(r => (
              <div key={r.id} style={styles.item}>
                <p style={styles.itemContent}>{r.content}</p>
                <div style={styles.itemMeta}>
                  <span>By: {r.created_by}</span>
                  <button style={styles.deleteBtn} onClick={() => handleDeleteRetweet(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div>
          <div style={styles.addSection}>
            <h3 style={styles.sectionTitle}>Upload Excel File</h3>
            <p style={styles.hint}>Excel file must have a column named <strong>content</strong></p>
            <div style={styles.uploadBox}>
              <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)}
                style={styles.fileInput} />
              {file && <p style={styles.fileName}>Selected: {file.name}</p>}
            </div>
            <button style={styles.addBtn} onClick={handleUpload} disabled={loading || !file}>
              {loading ? 'Uploading...' : '📤 Upload Excel'}
            </button>
          </div>
          <h3 style={styles.sectionTitle}>Uploaded Posts ({uploadedPosts.length})</h3>
          <div style={styles.list}>
            {uploadedPosts.map(p => (
              <div key={p.id} style={styles.item}>
                <p style={styles.itemContent}>{p.content}</p>
                <div style={styles.itemMeta}>
                  <span>By: {p.uploaded_by_admin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px', maxWidth: '960px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' },
  subtitle: { color: '#666', margin: 0 },
  success: {
    background: '#f0fff4', border: '1px solid #c3e6cb', color: '#155724',
    padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
  },
  error: {
    background: '#fff5f5', border: '1px solid #f5c6cb', color: '#721c24',
    padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
  },
  stats: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: {
    background: '#fff', borderRadius: '10px', padding: '18px 24px',
    flex: '1', minWidth: '140px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  statNum: { fontSize: '2rem', fontWeight: 700 },
  statLabel: { color: '#666', fontSize: '0.9rem', marginTop: '4px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    padding: '10px 20px', border: '2px solid #e0e0e0', borderRadius: '8px',
    background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#555',
  },
  activeTab: { borderColor: '#1a1a2e', background: '#1a1a2e', color: '#fff' },
  addSection: {
    background: '#fff', borderRadius: '12px', padding: '22px',
    marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  sectionTitle: { margin: '0 0 14px', fontWeight: 700, color: '#333' },
  hint: { color: '#888', fontSize: '0.9rem', margin: '0 0 12px' },
  textarea: {
    width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px',
    fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box', color: '#333',
  },
  addBtn: {
    marginTop: '12px', padding: '10px 24px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
  },
  uploadBox: { border: '2px dashed #ccc', borderRadius: '8px', padding: '24px', textAlign: 'center' },
  fileInput: { cursor: 'pointer' },
  fileName: { marginTop: '8px', color: '#333', fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: {
    background: '#fff', borderRadius: '10px', padding: '16px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  },
  itemContent: { margin: '0 0 10px', color: '#333', lineHeight: 1.5 },
  itemMeta: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: '0.85rem', color: '#888',
  },
  deleteBtn: {
    background: '#dc3545', color: '#fff', border: 'none', padding: '5px 12px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
  },
};
