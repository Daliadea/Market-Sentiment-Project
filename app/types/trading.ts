export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface BacktestResults {
  totalReturn: number;
  maxDrawdown: number;
  winRate: number;
  trades: number;
  profitableTrades: number;
}

export interface BacktestParams {
  ticker: string;
  startDate: string;
  endDate: string;
}

export interface LeadingIndicator {
  name: string;
  status: 'Bullish' | 'Neutral' | 'Bearish';
  reason: string;
}

export interface FundamentalAnalysis {
  sentiment_score: number;
  sentiment_summary: string;
  fair_value_estimate: string;
  leading_indicators: LeadingIndicator[];
}

