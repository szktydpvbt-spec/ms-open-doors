"use client";

import { useState } from "react";
import { formatDate } from "@/lib/formatDate";
import CommentSection from "@/components/CommentSection";

function HeartIcon({ filled }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M12 20s-7-4.4-9.3-8.8C1.3 8 3 5 6.3 5c1.8 0 3.2 1 4.7 3 1.5-2 2.9-3 4.7-3 3.3 0 5 3 3.6 6.2C19 15.6 12 20 12 20Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PostCard({
  post,
  currentUserId,
  isAdmin,
  canComment,
  likeCount = 0,
  isLiked = false,
  onToggleLike,
  onDeletePost,
  onAddComment,
  onDeleteComment,
}) {
  const [showComments, setShowComments] = useState(false);
  const authorName = post.profiles?.full_name || "Üye";
  const initial = authorName.trim().charAt(0).toUpperCase() || "?";
  const commentCount = post.comments?.length || 0;

  return (
    <div className="card">
      <div className="post-author">
        <div className="avatar">{initial}</div>
        <div>
          <div>{authorName}</div>
          <div className="post-meta">{formatDate(post.created_at)}</div>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <button
          className={`like-btn ${isLiked ? "liked" : ""}`}
          onClick={onToggleLike}
          disabled={!canComment}
          aria-label={isLiked ? "Beğeniyi kaldır" : "Beğen"}
        >
          <HeartIcon filled={isLiked} />
        </button>
        {(post.user_id === currentUserId || isAdmin) && (
          <button
            className="btn btn-sm btn-danger"
            style={{ marginLeft: "auto" }}
            onClick={() => onDeletePost(post.id)}
          >
            Sil
          </button>
        )}
      </div>

      {likeCount > 0 && (
        <p className="like-count">
          {likeCount} kişi beğendi
        </p>
      )}

      <button className="comment-toggle" onClick={() => setShowComments((v) => !v)}>
        {commentCount === 0
          ? "İlk yorumu sen yaz"
          : showComments
          ? "Yorumları gizle"
          : `${commentCount} yorumun tümünü gör`}
      </button>

      {showComments && (
        <CommentSection
          comments={post.comments || []}
          canComment={canComment}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onAddComment={(text) => onAddComment(post.id, text)}
          onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
        />
      )}
    </div>
  );
}
