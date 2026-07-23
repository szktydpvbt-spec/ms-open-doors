"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2c2.4.4 4.5 2.5 4.5 5.8" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5h16v11H8l-4 4V5Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20s-7-4.4-9.3-8.8C1.3 8 3 5 6.3 5c1.8 0 3.2 1 4.7 3 1.5-2 2.9-3 4.7-3 3.3 0 5 3 3.6 6.2C19 15.6 12 20 12 20Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconInfinity() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6.5 9a3.5 3.5 0 1 0 0 7c2.5 0 4-2 5.5-3.5C13.5 11 15 9 17.5 9a3.5 3.5 0 1 1 0 7c-2.5 0-4-2-5.5-3.5C10.5 11 9 9 6.5 9Z" />
    </svg>
  );
}

export default function StatsBar() {
  const [stats, setStats] = useState({ members: 0, posts: 0, comments: 0 });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function loadStats() {
      const [{ count: members }, { count: posts }, { count: comments }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        members: members || 0,
        posts: posts || 0,
        comments: comments || 0,
      });
    }

    loadStats();
  }, []);

  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-icon">
          <IconUsers />
        </div>
        <span className="stat-value">{stats.members}</span>
        <span className="stat-label">Üye</span>
      </div>
      <div className="stat">
        <div className="stat-icon">
          <IconChat />
        </div>
        <span className="stat-value">{stats.posts}</span>
        <span className="stat-label">Paylaşım</span>
      </div>
      <div className="stat">
        <div className="stat-icon">
          <IconHeart />
        </div>
        <span className="stat-value">{stats.comments}</span>
        <span className="stat-label">Destek</span>
      </div>
      <div className="stat">
        <div className="stat-icon">
          <IconInfinity />
        </div>
        <span className="stat-value">∞</span>
        <span className="stat-label">Umut</span>
      </div>
    </div>
  );
}
