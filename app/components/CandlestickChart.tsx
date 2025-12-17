'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OHLCData } from '../types/trading';

interface CandlestickChartProps {
  data: OHLCData[];
  height?: number;
}

export default function CandlestickChart({ data, height = 600 }: CandlestickChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length === 0) return;

    const formatted = data.map(candle => ({
      date: new Date(candle.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: candle.close,
      time: candle.time,
    }));

    setChartData(formatted);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
        <p className="text-slate-400">No data to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 p-4" style={{ minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace'
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
