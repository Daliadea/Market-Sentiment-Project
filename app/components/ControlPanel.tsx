'use client';

import { useState } from 'react';
import { BacktestResults } from '../types/trading';

interface ControlPanelProps {
  onRunBacktest: (ticker: string, startDate: string, endDate: string) => void;
  results: BacktestResults | null;
  isLoading: boolean;
}

export default function ControlPanel({ onRunBacktest, results, isLoading }: ControlPanelProps) {
  // Calculate dates for free API tier (last 100 days)
  const today = new Date();
  const hundredDaysAgo = new Date();
  hundredDaysAgo.setDate(today.getDate() - 100);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  const [ticker, setTicker] = useState('AAPL');
  const [startDate, setStartDate] = useState(formatDate(hundredDaysAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [dateWarning, setDateWarning] = useState('');

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const selectedDate = new Date(value);
    const oldestAllowed = new Date();
    oldestAllowed.setDate(oldestAllowed.getDate() - 100);
    
    if (selectedDate < oldestAllowed) {
      setDateWarning('⚠️ Dates older than 100 days require Premium API. Using free tier = last 100 days only.');
    } else {
      setDateWarning('');
    }
    
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunBacktest(ticker, startDate, endDate);
  };

  return (
    <div className="w-full h-full bg-slate-900 p-6 border-l border-slate-700 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Control Panel</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticker Input */}
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-slate-300 mb-2">
            Ticker Symbol
          </label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
            placeholder="AAPL"
            required
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            max={formatDate(new Date())}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
            required
          />
        </div>

        {/* Date Warning */}
        {dateWarning && (
          <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs">
            {dateWarning}
          </div>
        )}

        {/* API Tier Info */}
        <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs">
          💡 Free API: Last 100 days only. For older data, app uses realistic demo mode.
        </div>

        {/* Run Backtest Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-emerald-500/50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Backtest...
            </span>
          ) : (
            'Run Backtest'
          )}
        </button>
      </form>

      {/* Results Card */}
      {results && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Results</h3>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Return</div>
            <div className={`text-3xl font-bold font-mono ${results.totalReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Max Drawdown</div>
            <div className="text-3xl font-bold font-mono text-rose-500">
              -{results.maxDrawdown.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Win Rate</div>
            <div className={`text-3xl font-bold font-mono ${results.winRate >= 50 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {results.winRate.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Trades</div>
            <div className="text-3xl font-bold font-mono text-slate-100">
              {results.trades}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Profitable Trades</div>
            <div className="text-3xl font-bold font-mono text-emerald-500">
              {results.profitableTrades} / {results.trades}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

