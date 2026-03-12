import { useState } from "react";

export default function PostCard({ post }: any) {
  const [posted, setPosted] = useState(false);

  // Remove numbering from beginning (1. 2) 3 - 01: etc)
  const cleanContent = post.content.replace(/^\s*\d+[\.\)\-:\s]+/, "");

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    cleanContent
  )}`;

  const handlePost = () => {
    setPosted(true);
  };

  return (
    <div className="post-item">

      {/* Tweet Content */}
      <div className="post-content">
        {cleanContent}
      </div>

      {/* Actions */}
      <div className="post-actions">

        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-tweet"
          onClick={handlePost}
        >
          {posted ? "Post Again" : "Post on X"}
        </a>

      </div>

    </div>
  );
}