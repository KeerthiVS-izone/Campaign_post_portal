import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getCampaignPosts, CampaignPost } from '../api';
import PostCard from '../components/PostCard';

interface LocationState {
  name?: string;
}

export default function PostsPage() {
  const location = useLocation();
  const savedUser = localStorage.getItem("campaign_user");
const volunteerName = savedUser ? JSON.parse(savedUser).name : undefined;

  const [posts, setPosts] = useState<CampaignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showWelcome, setShowWelcome] = useState(!!volunteerName);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getCampaignPosts();
        setPosts(data);
      } catch {
        setError('இடுகைகளை ஏற்ற முடியவில்லை. சர்வர் இயங்குகிறதா என சரிபாருங்கள்.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();

    if (volunteerName) {
      const t = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(t);
    }
  }, [volunteerName]);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    return posts.filter(p =>
      p.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-line" style={{ width: '90%' }} />
      <div className="skeleton-line" style={{ width: '75%' }} />
      <div className="skeleton-line" style={{ width: '55%', marginBottom: 0 }} />
    </div>
  );

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div>
      {/* Welcome toast */}
      {showWelcome && volunteerName && (
        <div className="toast toast-success">
          <span>🎉</span>
          <span>வரவேற்கிறோம், <strong>{volunteerName}</strong>! பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது.</span>
        </div>
      )}

      {/* Step indicator */}
      <div className="step-indicator">
        <div className="step done">
          <div className="step-num">✓</div>
          <span>பதிவு படிவம்</span>
        </div>
        <div className="step-line" />
        <div className="step active">
          <div className="step-num">2</div>
          <span>பிரச்சார இடுகைகள்</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="posts-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* <Link to="/" className="btn-back">← திரும்பு</Link> */}
          {!loading && (
            <span className="posts-count">{filteredPosts.length} இடுகைகள்</span>
          )}
        </div>

        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="இடுகைகளை தேடுங்கள்..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '16px', lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="posts-list">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Posts */}
      {!loading && !error && (
        <>
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{search ? '🔍' : '📭'}</div>
              <h3>{search ? 'தேடல் முடிவுகள் இல்லை' : 'இன்னும் இடுகைகள் இல்லை'}</h3>
              <p>
                {search
                  ? `"${search}" என்ற வார்த்தை கொண்ட இடுகைகள் இல்லை`
                  : 'Excel கோப்பு மூலம் இடுகைகளை சேர்க்கவும்'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="posts-list">
                {paginatedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                  />
                ))}
              </div>

              <div className="pagination">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>

              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
