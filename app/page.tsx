'use client';

import { useState } from 'react';
import CandlestickChart from './components/CandlestickChart';
import ControlPanel from './components/ControlPanel';
import { OHLCData, BacktestResults } from './types/trading';
import { runBacktest } from './utils/mockData';
import { runRealBacktest } from './utils/finnhubApi';

export default function Home() {
  const [chartData, setChartData] = useState<OHLCData[]>([]);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTicker, setCurrentTicker] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [useRealData, setUseRealData] = useState(true); // default to real data

  const handleRunBacktest = async (ticker: string, startDate: string, endDate: string) => {
    setIsLoading(true);
    setCurrentTicker(ticker);
    setError('');
    
    try {
      // Try real data first if enabled
      if (useRealData) {
        try {
          const { data, results } = await runRealBacktest(ticker, startDate, endDate);
          setChartData(data);
          setResults(results);
          return;
        } catch (apiError) {
          console.warn('Real API failed, falling back to mock data:', apiError);
          setError('Using demo data (API unavailable)');
          // Fall through to mock data
        }
      }
      
      // Fallback to mock data
      const { data, results } = await runBacktest(ticker, startDate, endDate);
      setChartData(data);
      setResults(results);
    } catch (error) {
      console.error('Error running backtest:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Trading Strategy Backtester
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {useRealData ? '🟢 Live market data via Finnhub' : '⚪ Demo mode'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Data source toggle */}
            <button
              onClick={() => setUseRealData(!useRealData)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm"
            >
              <span className={useRealData ? 'text-emerald-500' : 'text-slate-400'}>
                {useRealData ? '📡 Real Data' : '🎲 Demo Data'}
              </span>
            </button>
            
            {currentTicker && (
              <div className="text-right">
                <div className="text-sm text-slate-400">Current Symbol</div>
                <div className="text-2xl font-bold font-mono text-emerald-500">
                  {currentTicker}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mt-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-sm">
            {error}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chart Area - 70% */}
        <div className="flex-[7] p-6">
          <div className="h-full flex items-center justify-center">
            {chartData.length > 0 ? (
              <CandlestickChart data={chartData} />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-slate-300 mb-2">
                  Ready to go
                </h2>
                <p className="text-slate-400">
                  Type a ticker (AAPL, TSLA, NVDA...) and hit &quot;Run Backtest&quot;
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {useRealData ? 'Using real market data from Finnhub' : 'Using demo data'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Control Panel - 30% */}
        <div className="flex-[3] min-w-[350px] max-w-[500px]">
          <ControlPanel
            onRunBacktest={handleRunBacktest}
            results={results}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
