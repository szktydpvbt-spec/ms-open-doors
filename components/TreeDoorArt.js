// Sabit "rastgele" nokta konumları — her render'da aynı kalması için
// Math.random() yerine deterministik bir üretici kullanılıyor.
function seededPoints(count, seedBase) {
  const points = [];
  let seed = seedBase;
  for (let i = 0; i < count; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const r1 = seed / 233280;
    seed = (seed * 9301 + 49297) % 233280;
    const r2 = seed / 233280;
    points.push([r1, r2]);
  }
  return points;
}

function CanopyCluster({ cx, cy, r, seed }) {
  const dots = seededPoints(22, seed);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#171308" opacity="0.5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c9a227" strokeWidth="1.2" opacity="0.5" />
      {dots.map(([r1, r2], i) => {
        const angle = r1 * Math.PI * 2;
        const dist = Math.sqrt(r2) * r * 0.92;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const size = 0.6 + ((i * 37) % 10) / 10;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={size}
            fill={i % 3 === 0 ? "#f3d98a" : "#c9a227"}
            opacity={0.35 + (i % 4) * 0.15}
          />
        );
      })}
    </g>
  );
}

export default function TreeDoorArt() {
  const canopies = [
    { cx: 160, cy: 58, r: 62, seed: 11 },
    { cx: 95, cy: 78, r: 46, seed: 23 },
    { cx: 225, cy: 78, r: 46, seed: 37 },
    { cx: 55, cy: 108, r: 32, seed: 51 },
    { cx: 265, cy: 108, r: 32, seed: 61 },
    { cx: 128, cy: 92, r: 34, seed: 71 },
    { cx: 192, cy: 92, r: 34, seed: 83 },
  ];

  return (
    <svg
      className="hero-tree"
      viewBox="0 0 320 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Işıklı bir kapıya doğru uzanan yol ve üzerinde altın yapraklı bir ağaç"
    >
      <defs>
        <radialGradient id="doorGlow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#f6d98a" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#e8c766" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e8c766" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c766" />
          <stop offset="100%" stopColor="#7a651f" />
        </linearGradient>
      </defs>

      {/* Zemin ışığı */}
      <ellipse cx="160" cy="252" rx="70" ry="14" fill="url(#doorGlow)" opacity="0.6" />

      {/* Kapıya giden yol */}
      <path
        d="M160 232 L160 288"
        stroke="#e8c766"
        strokeWidth="2"
        strokeDasharray="2 10"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Kapı çerçevesi */}
      <circle cx="160" cy="205" r="46" fill="url(#doorGlow)" />
      <path
        d="M138 232 L138 178 Q138 152 160 152 Q182 152 182 178 L182 232 Z"
        fill="#0a0a0a"
        stroke="#f3d98a"
        strokeWidth="2.5"
      />
      <line x1="160" y1="157" x2="160" y2="232" stroke="#f3d98a" strokeWidth="1" opacity="0.55" />
      <circle cx="153" cy="196" r="1.6" fill="#f3d98a" />

      {/* Gövde */}
      <path
        d="M160 152 C158 132 150 118 150 100 M160 152 C162 132 170 118 170 100"
        fill="none"
        stroke="url(#trunkGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M150 100 C140 88 122 90 108 78 M170 100 C180 88 198 90 212 78"
        fill="none"
        stroke="url(#trunkGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Yapraklı taç kümeleri */}
      {canopies.map((c, i) => (
        <CanopyCluster key={i} {...c} />
      ))}

      {/* Serpiştirilmiş parıltılar */}
      {seededPoints(14, 5).map(([r1, r2], i) => (
        <circle
          key={`spark-${i}`}
          cx={30 + r1 * 260}
          cy={20 + r2 * 90}
          r={0.8 + (i % 3) * 0.5}
          fill="#f3d98a"
          opacity={0.3 + (i % 4) * 0.12}
        />
      ))}
    </svg>
  );
}
