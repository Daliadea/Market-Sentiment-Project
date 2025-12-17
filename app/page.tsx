'use client';

import { useState } from 'react';
import CandlestickChart from './components/CandlestickChart';
import ControlPanel from './components/ControlPanel';
import { OHLCData, BacktestResults } from './types/trading';
import { runBacktest } from './utils/mockData';

export default function Home() {
  const [chartData, setChartData] = useState<OHLCData[]>([]);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTicker, setCurrentTicker] = useState<string>('');

  const handleRunBacktest = async (ticker: string, startDate: string, endDate: string) => {
    setIsLoading(true);
    setCurrentTicker(ticker);
    
    try {
      const { data, results } = await runBacktest(ticker, startDate, endDate);
      setChartData(data);
      setResults(results);
    } catch (error) {
      console.error('Error running backtest:', error);
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
              Algorithmic Trading Backtester
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Visualize trading strategy performance on historical data
            </p>
          </div>
          {currentTicker && (
            <div className="text-right">
              <div className="text-sm text-slate-400">Current Symbol</div>
              <div className="text-2xl font-bold font-mono text-emerald-500">
                {currentTicker}
              </div>
            </div>
          )}
        </div>
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
                  No Data Yet
                </h2>
                <p className="text-slate-400">
                  Enter a ticker symbol and date range, then click &quot;Run Backtest&quot; to visualize the data
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
