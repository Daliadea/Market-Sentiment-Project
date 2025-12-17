'use client';

import { useState } from 'react';
import CandlestickChart from './components/CandlestickChart';
import ControlPanel from './components/ControlPanel';
import FundamentalIntelligence from './components/FundamentalIntelligence';
import { OHLCData, BacktestResults, FundamentalAnalysis } from './types/trading';
import { runBacktest } from './utils/mockData';
import { runAlphaVantageBacktest } from './utils/alphaVantageApi';

export default function Home() {
  const [chartData, setChartData] = useState<OHLCData[]>([]);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTicker, setCurrentTicker] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [useRealData, setUseRealData] = useState(true); // default to real data
  const [dataSource, setDataSource] = useState<'real' | 'demo' | null>(null);
  const [fundamentalData, setFundamentalData] = useState<FundamentalAnalysis | null>(null);
  const [fundamentalLoading, setFundamentalLoading] = useState(false);

  const fetchFundamentalAnalysis = async (ticker: string) => {
    setFundamentalLoading(true);
    try {
      const response = await fetch('/api/fundamental-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fundamental analysis');
      }

      const data = await response.json();
      setFundamentalData(data);
    } catch (error) {
      console.error('Error fetching fundamental analysis:', error);
      // Set null but don't show error - AI analysis is optional
      setFundamentalData(null);
    } finally {
      setFundamentalLoading(false);
    }
  };

  const handleRunBacktest = async (ticker: string, startDate: string, endDate: string) => {
    setIsLoading(true);
    setCurrentTicker(ticker);
    setError('');
    setDataSource(null);
    
    try {
      // Try real data first if enabled
      if (useRealData) {
        try {
          const { data, results } = await runAlphaVantageBacktest(ticker, startDate, endDate);
          setChartData(data);
          setResults(results);
          setError('');
          setDataSource('real'); // Mark as real data
          
          // Fetch fundamental analysis in parallel
          fetchFundamentalAnalysis(ticker);
          return;
        } catch (apiError: any) {
          console.warn('Alpha Vantage API failed, falling back to mock data:', apiError);
          // Fall through to mock data
        }
      }
      
      // Fallback to mock data (or demo mode)
      const { data, results } = await runBacktest(ticker, startDate, endDate);
      setChartData(data);
      setResults(results);
      setError('');
      setDataSource('demo'); // Mark as demo data
      
      // Fetch fundamental analysis even for demo data
      fetchFundamentalAnalysis(ticker);
    } catch (error) {
      console.error('Error running backtest:', error);
      setError('Failed to load data. Please try again.');
      setDataSource(null);
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
              {useRealData ? '🟢 Real market data via Alpha Vantage' : '⚪ Demo mode'}
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
        
        {/* Data source indicator */}
        {dataSource === 'real' && (
          <div className="mt-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            Using real market data from Alpha Vantage (last 100 days)
          </div>
        )}
        {dataSource === 'demo' && useRealData && (
          <div className="mt-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-sm flex items-center gap-2">
            <span className="text-amber-500">ℹ</span>
            Using demo data (Alpha Vantage API unavailable or date range too old)
          </div>
        )}
        {dataSource === 'demo' && !useRealData && (
          <div className="mt-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 text-sm flex items-center gap-2">
            <span className="text-blue-500">ℹ</span>
            Demo mode active - showing realistic simulated data
          </div>
        )}
        {error && (
          <div className="mt-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-sm flex items-center gap-2">
            <span className="text-rose-500">✕</span>
            {error}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Area - Chart + AI Analysis - 70% */}
        <div className="flex-[7] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Chart Area */}
            <div className="h-[500px] flex items-center justify-center">
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
                    {useRealData ? 'Using real market data from Alpha Vantage' : 'Using demo data'}
                  </p>
                </div>
              )}
            </div>

            {/* AI Fundamental Intelligence Panel */}
            <FundamentalIntelligence
              data={fundamentalData}
              loading={fundamentalLoading}
              ticker={currentTicker}
            />
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
