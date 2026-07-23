"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// Positions are percentages measured against the reference hero photo
// (946x816), centered on the "256 / 128 / 97" number spots that were
// blanked out of the image. The 4th stat ("Umut" / ∞) stays baked into
// the photo since it never changes.
const POSITIONS = [
  { key: "members", left: 16.92, top: 79.9 },
  { key: "posts", left: 38.58, top: 79.9 },
  { key: "comments", left: 60.51, top: 79.9 },
];

export default function HeroStatsOverlay() {
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
    <div className="hero-stats-overlay">
      {POSITIONS.map((p) => (
        <span
          key={p.key}
          className="hero-stat-value"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          {stats[p.key]}
        </span>
      ))}
    </div>
  );
}
