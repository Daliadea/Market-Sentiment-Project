'use client';

import { LeadingIndicator } from '../types/trading';

interface LeadingIndicatorsProps {
  indicators: LeadingIndicator[];
}

export default function LeadingIndicators({ indicators }: LeadingIndicatorsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bullish':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: '📈',
        };
      case 'Bearish':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          icon: '📉',
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400',
          icon: '➖',
        };
    }
  };

  return (
    <div className="space-y-3">
      {indicators.map((indicator, index) => {
        const colors = getStatusColor(indicator.status);
        
        return (
          <div
            key={index}
            className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-200">
                  {indicator.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{colors.icon}</span>
                <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}>
                  {indicator.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {indicator.reason}
            </p>
          </div>
        );
      })}
    </div>
  );
}

