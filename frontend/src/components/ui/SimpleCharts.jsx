import React from 'react';

/**
 * A simple SVG line chart for trends
 */
export const SimpleLineChart = ({ data, color = "#001e40", height = 100 }) => {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = range * 0.1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min + padding) / (range + padding * 2)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Area fill */}
        <polyline
          fill={`${color}15`}
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    </div>
  );
};

/**
 * A simple SVG bar chart
 */
export const SimpleBarChart = ({ data, color = "#FF8C00", height = 100 }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data);
  const barWidth = 100 / data.length - 2;

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {data.map((val, i) => (
          <rect
            key={i}
            x={i * (100 / data.length) + 1}
            y={100 - (val / max) * 100}
            width={barWidth}
            height={(val / max) * 100}
            fill={color}
            rx="2"
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * A simple SVG Pie chart (Circle segment)
 */
export const SimplePieChart = ({ percent, color = "#10b981", size = 80 }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#1e293b">{percent}%</text>
      </svg>
    </div>
  );
};
