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

