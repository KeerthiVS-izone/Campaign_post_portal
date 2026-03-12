import { useEffect, useState } from 'react';
import { getPosts, getRetweets, getUploadedPosts } from '../services/api';
import type { Post, Retweet, UploadedPost } from '../types';

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [retweets, setRetweets] = useState<Retweet[]>([]);
  const [uploadedPosts, setUploadedPosts] = useState<UploadedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'uploaded'>('posts');

  useEffect(() => {
    Promise.all([getPosts(), getRetweets(), getUploadedPosts()])
      .then(([p, r, u]) => {
        setPosts(p.data);
        setRetweets(r.data);
        setUploadedPosts(u.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tweetUrl = (content: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;

  const retweetUrl = (content: string) =>
    `https://twitter.com/intent/retweet?tweet_id=&text=${encodeURIComponent(content)}`;

  if (loading) return <div style={styles.loading}>Loading campaign posts...</div>;

  const allPosts: { id: number; content: string; source: string }[] = [
    ...(activeTab === 'posts' ? posts.map(p => ({ ...p, source: 'Campaign' })) : []),
    ...(activeTab === 'uploaded' ? uploadedPosts.map(p => ({ id: p.id, content: p.content, source: 'Excel Upload' })) : []),
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📢 Campaign Posts</h1>
        <p style={styles.subtitle}>Share these posts on X (Twitter) to spread the campaign</p>
      </div>

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(activeTab === 'posts' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('posts')}>
          Admin Posts ({posts.length})
        </button>
        <button style={{ ...styles.tab, ...(activeTab === 'uploaded' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('uploaded')}>
          Uploaded Posts ({uploadedPosts.length})
        </button>
      </div>

      <div style={styles.grid}>
        {allPosts.map(post => (
          <div key={post.id} style={styles.card}>
            <div style={styles.badge}>{post.source}</div>
            <p style={styles.content}>{post.content}</p>
            <div style={styles.actions}>
              <a href={tweetUrl(post.content)} target="_blank" rel="noreferrer" style={styles.tweetBtn}>
                🐦 Post on X
              </a>
            </div>

            {retweets.length > 0 && (
              <div style={styles.retweetSection}>
                <p style={styles.retweetTitle}>🔄 Retweet Content</p>
                {retweets.map(rt => (
                  <div key={rt.id} style={styles.retweetItem}>
                    <p style={styles.retweetContent}>{rt.content}</p>
                    <a href={retweetUrl(rt.content)} target="_blank" rel="noreferrer" style={styles.retweetBtn}>
                      Retweet
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {allPosts.length === 0 && (
        <div style={styles.empty}>
          <p>No posts available yet. Check back later!</p>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '28px' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#555', fontSize: '1rem' },
  loading: { textAlign: 'center', padding: '60px', color: '#555', fontSize: '1.1rem' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: {
    padding: '10px 20px', border: '2px solid #e0e0e0', borderRadius: '8px',
    background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#555',
  },
  activeTab: { borderColor: '#1a1a2e', background: '#1a1a2e', color: '#fff' },
  grid: { display: 'flex', flexDirection: 'column', gap: '18px' },
  card: {
    background: '#fff', borderRadius: '12px', padding: '22px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0',
  },
  badge: {
    display: 'inline-block', background: '#e8f4fd', color: '#1565c0',
    padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '10px',
  },
  content: { fontSize: '1.05rem', color: '#333', lineHeight: 1.6, margin: '0 0 14px' },
  actions: { marginBottom: '14px' },
  tweetBtn: {
    display: 'inline-block', background: '#000', color: '#fff',
    padding: '9px 20px', borderRadius: '25px', textDecoration: 'none',
    fontWeight: 600, fontSize: '0.9rem',
  },
  retweetSection: {
    borderTop: '1px solid #f0f0f0', paddingTop: '14px', marginTop: '8px',
  },
  retweetTitle: { fontWeight: 700, color: '#555', fontSize: '0.9rem', margin: '0 0 10px' },
  retweetItem: {
    background: '#f8f9fa', borderRadius: '8px', padding: '12px',
    marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
  },
  retweetContent: { margin: 0, fontSize: '0.9rem', color: '#444', flex: 1 },
  retweetBtn: {
    background: '#1da1f2', color: '#fff', padding: '6px 14px',
    borderRadius: '20px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
  },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
};
