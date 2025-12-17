'use client';

import { FundamentalAnalysis } from '../types/trading';
import SentimentGauge from './SentimentGauge';
import LeadingIndicators from './LeadingIndicators';

interface FundamentalIntelligenceProps {
  data: FundamentalAnalysis | null;
  loading: boolean;
  ticker: string;
}

export default function FundamentalIntelligence({
  data,
  loading,
  ticker,
}: FundamentalIntelligenceProps) {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
        <h2 className="text-xl font-bold text-slate-200 mb-6">
          🤖 AI Fundamental Insight
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-slate-400 text-sm">Reading Analyst Reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
        <h2 className="text-xl font-bold text-slate-200 mb-6">
          🤖 AI Fundamental Insight
        </h2>
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">
            Select a ticker and run backtest to see AI analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-200">
          🤖 AI Fundamental Insight
        </h2>
        <div className="text-xs text-slate-500">
          Powered by Gemini 1.5 Flash
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Sentiment Gauge */}
        <div>
          <SentimentGauge
            score={data.sentiment_score}
            summary={data.sentiment_summary}
          />
        </div>

        {/* Middle: Fair Value */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">
            Fair Value Estimate
          </h3>
          <div className="flex items-center justify-center h-32">
            {data.fair_value_estimate === 'N/A' ? (
              <div className="text-center">
                <div className="text-slate-500 text-2xl mb-2">—</div>
                <div className="text-xs text-slate-500">
                  No price targets found in recent news
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold font-mono text-emerald-400">
                  {data.fair_value_estimate}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Analyst Consensus
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-500 text-center">
              Based on recent analyst reports
            </div>
          </div>
        </div>

        {/* Right: Leading Indicators */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">
            Key Metrics for {ticker}
          </h3>
          <LeadingIndicators indicators={data.leading_indicators} />
        </div>
      </div>
    </div>
  );
}

