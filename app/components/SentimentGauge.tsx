'use client';

interface SentimentGaugeProps {
  score: number; // 0-100
  summary: string;
}

export default function SentimentGauge({ score, summary }: SentimentGaugeProps) {
  // Calculate gauge rotation (-90deg = 0, 90deg = 100)
  const rotation = -90 + (score * 1.8);
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 70) return '#10b981'; // Emerald (Greed)
    if (score >= 50) return '#3b82f6'; // Blue (Neutral-Bullish)
    if (score >= 30) return '#f59e0b'; // Amber (Neutral-Bearish)
    return '#f43f5e'; // Rose (Fear)
  };

  const getSentimentLabel = () => {
    if (score >= 70) return 'Extreme Greed';
    if (score >= 60) return 'Greed';
    if (score >= 50) return 'Neutral-Bullish';
    if (score >= 40) return 'Neutral-Bearish';
    if (score >= 30) return 'Fear';
    return 'Extreme Fear';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Market Sentiment</h3>
      
      {/* Gauge */}
      <div className="relative w-48 h-24 mx-auto mb-4">
        {/* Background arc */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Gradient for arc */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="20"
            stroke={getColor()}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transformOrigin: '100px 90px',
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 1s ease-out',
            }}
          />
          
          {/* Center dot */}
          <circle cx="100" cy="90" r="6" fill={getColor()} />
        </svg>
      </div>

      {/* Score */}
      <div className="text-center mb-3">
        <div className="text-4xl font-bold font-mono" style={{ color: getColor() }}>
          {score}
        </div>
        <div className="text-sm text-slate-400 mt-1">
          {getSentimentLabel()}
        </div>
      </div>

      {/* Summary */}
      <div className="text-xs text-slate-400 text-center px-2">
        {summary}
      </div>
    </div>
  );
}

