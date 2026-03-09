// import { useState } from 'react';
// import { CampaignPost } from '../api';

// interface PostCardProps {
//   post: CampaignPost;
//   index: number;
// }

// export default function PostCard({ post, index }: PostCardProps) {
//   const [copied, setCopied] = useState(false);

//   const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}`;

//   // Extract hashtags for visual display
//   const hashtags = post.content.match(/#\w+/g) || [];
//   const contentWithoutTags = post.content.replace(/#\w+/g, '').trim();

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(post.content);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       // fallback
//       const el = document.createElement('textarea');
//       el.value = post.content;
//       document.body.appendChild(el);
//       el.select();
//       document.execCommand('copy');
//       document.body.removeChild(el);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div
//       className="post-card"
//       style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
//     >
//       <div className="post-number">{index + 1}</div>

//       <div className="post-body">
//         <p className="post-content">
//           {hashtags.length > 0 ? contentWithoutTags : post.content}
//         </p>
//         {hashtags.length > 0 && (
//           <div className="post-hashtags">
//             {hashtags.map((tag, i) => (
//               <span key={i} className="hashtag">{tag}</span>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="post-actions">
//         <a
//           href={tweetUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="btn-tweet"
//         >
//           <svg className="x-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.857L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
//           </svg>
//           X-ல் பதிவிடு
//         </a>

//         {/* <button
//           onClick={handleCopy}
//           className={`btn-copy ${copied ? 'copied' : ''}`}
//           title="உரையை நகலெடு"
//         >
//           {copied ? '✓ நகலெடுக்கப்பட்டது' : '📋 நகலெடு'}
//         </button> */}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";

export default function PostCard({ post, index }: any) {
  const [posted, setPosted] = useState(false);

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    post.content
  )}`;

  const handlePost = () => {
    setPosted(true);
  };

  return (
    <div className="post-item">

      <div className="post-content">
        {post.content}
      </div>

      <div className="post-actions">

        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-tweet"
          onClick={handlePost}
        >
          {/* <svg className="x-logo" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.857L1.254 2.25H8.08l4.259 5.63L18.244 2.25z"/>
          </svg> */}

          {posted ? "Post Again" : "Post on X"}

        </a>

      </div>
    </div>
  );
}