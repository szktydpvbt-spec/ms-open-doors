"use client";

import { useState } from "react";
import { formatDate } from "@/lib/formatDate";

export default function CommentSection({
  comments,
  canComment,
  currentUserId,
  isAdmin,
  onAddComment,
  onDeleteComment,
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    await onAddComment(text.trim());
    setText("");
    setSubmitting(false);
  }

  return (
    <div className="comment-list">
      {comments.length === 0 && (
        <p className="muted" style={{ fontSize: 13 }}>
          Henüz yorum yok. İlk yorumu sen yaz.
        </p>
      )}

      {comments.length > 0 && (
        <div className="comment-scroll">
          {comments.map((c) => (
            <div className="comment" key={c.id}>
              <span className="comment-author">{c.profiles?.full_name || "Üye"}</span>
              <span className="muted" style={{ fontSize: 12 }}>
                {formatDate(c.created_at)}
              </span>
              <p style={{ margin: "4px 0 0" }}>{c.content}</p>
              {(c.user_id === currentUserId || isAdmin) && (
                <button
                  className="btn btn-sm btn-danger"
                  style={{ marginTop: 6 }}
                  onClick={() => onDeleteComment(c.id)}
                >
                  Sil
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {canComment ? (
        <form className="form" style={{ marginTop: 6 }} onSubmit={handleSubmit}>
          <textarea
            rows={2}
            placeholder="Bir yorum yaz..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-sm" type="submit" disabled={submitting}>
            {submitting ? "Gönderiliyor..." : "Yorum Yap"}
          </button>
        </form>
      ) : (
        <p className="muted" style={{ fontSize: 13 }}>
          Yorum yapmak için giriş yapmalısın.
        </p>
      )}
    </div>
  );
}
