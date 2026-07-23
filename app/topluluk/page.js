"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import PostCard from "@/components/PostCard";

const POST_SELECT =
  "id, content, created_at, user_id, profiles(full_name), comments(id, content, created_at, user_id, profiles(full_name)), likes(id, user_id)";

export default function CommunityPage() {
  const { session, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false });

    if (!fetchError && data) {
      const sorted = data.map((p) => ({
        ...p,
        comments: [...(p.comments || [])].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ),
      }));
      setPosts(sorted);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!newPost.trim() || !session) return;
    setPosting(true);
    setError("");
    const { error: insertError } = await supabase
      .from("posts")
      .insert({ content: newPost.trim(), user_id: session.user.id });
    setPosting(false);
    if (insertError) {
      setError("Paylaşım gönderilemedi: " + insertError.message);
      return;
    }
    setNewPost("");
    loadPosts();
  }

  async function handleDeletePost(postId) {
    if (!confirm("Bu paylaşımı silmek istediğine emin misin?")) return;
    await supabase.from("posts").delete().eq("id", postId);
    loadPosts();
  }

  async function handleAddComment(postId, text) {
    if (!session) return;
    await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: session.user.id, content: text });
    loadPosts();
  }

  async function handleDeleteComment(postId, commentId) {
    if (!confirm("Yorumu silmek istediğine emin misin?")) return;
    await supabase.from("comments").delete().eq("id", commentId);
    loadPosts();
  }

  async function handleToggleLike(postId, alreadyLiked) {
    if (!session) return;
    if (alreadyLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", session.user.id);
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: session.user.id });
    }
    loadPosts();
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="section">
        <div className="container">
          <p className="notice">
            Topluluk özelliği için önce Supabase bağlantısı yapılandırılmalı (README dosyasına
            bakın).
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Topluluk</h1>

        {session ? (
          <form className="form card" onSubmit={handleCreatePost} style={{ maxWidth: "100%" }}>
            <label htmlFor="newPost">Bir şey paylaş</label>
            <textarea
              id="newPost"
              rows={3}
              placeholder="Deneyimini, sorunu ya da bir tavsiyeni paylaş..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={posting}>
              {posting ? "Paylaşılıyor..." : "Paylaş"}
            </button>
          </form>
        ) : (
          <div className="notice" style={{ marginBottom: 20 }}>
            Paylaşım yapmak ve yorum bırakmak için <Link href="/giris">giriş yap</Link> ya da{" "}
            <Link href="/kayit">ücretsiz üye ol</Link>.
          </div>
        )}

        <div className="feed-scroll" style={{ marginTop: 24 }}>
          <div className="stack">
            {loading && <p className="muted">Yükleniyor...</p>}
            {!loading && posts.length === 0 && (
              <p className="muted">Henüz paylaşım yok. İlk paylaşımı sen yap!</p>
            )}
            {posts.map((post) => {
              const likes = post.likes || [];
              const isLiked = Boolean(
                session && likes.some((l) => l.user_id === session.user.id)
              );
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={session?.user?.id}
                  isAdmin={profile?.is_admin}
                  canComment={Boolean(session)}
                  likeCount={likes.length}
                  isLiked={isLiked}
                  onToggleLike={() => handleToggleLike(post.id, isLiked)}
                  onDeletePost={handleDeletePost}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
