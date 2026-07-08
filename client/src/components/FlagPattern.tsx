// Signature SAP-logo shaped pattern — small quadrilaterals with the top-right
// corner cut diagonally, matching the SAP logo mark geometry.
// Arranged in a sparse grid, each one a different vivid color.

const COLORS = [
  '#FF6BB5', // pink
  '#1B90FF', // bright blue
  '#7ED321', // lime green
  '#FF3B3B', // red
  '#FF9500', // orange
  '#FFD000', // yellow
  '#B620E0', // purple
  '#89D1FF', // light blue
  '#00C9A7', // teal
  '#FF6F00', // deep orange
];

function seededColor(row: number, col: number): string {
  const index = (row * 7 + col * 13 + row * col * 3) % COLORS.length;
  return COLORS[index];
}

// SAP logo shape: rectangle with top-right corner cut diagonally
// top-left → (x, y)
// top-right cut → goes from (x + w - notch, y) to (x + w, y + notch)
// then down to bottom-right → (x + w, y + h)
// then left to bottom-left → (x, y + h)
// back up to top-left → (x, y)
function sapShapePath(x: number, y: number, w: number, h: number, notch: number): string {
  return [
    `M${x},${y}`,
    `L${x + w - notch},${y}`,
    `L${x + w},${y + notch}`,
    `L${x + w},${y + h}`,
    `L${x},${y + h}`,
    'Z',
  ].join(' ');
}

export function FlagPattern({
  className = '',
  opacity = 0.18,
}: {
  className?: string;
  opacity?: number;
}) {
  const cols = 5;
  const rows = 9;
  const cellW = 26;
  const cellH = 20;
  const notch = 8;
  const gapX = 120;
  const gapY = 96;
  const padX = 16;
  const padY = 16;
  const viewW = cols * gapX + padX * 2;
  const viewH = rows * gapY + padY * 2;

  return (
    <svg
      className={`pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const color = seededColor(row, col);
          const x = padX + col * gapX;
          const y = padY + row * gapY;
          return (
            <path
              key={`${row}-${col}`}
              d={sapShapePath(x, y, cellW, cellH, notch)}
              fill={color}
              opacity={opacity}
            />
          );
        })
      )}
    </svg>
  );
}
