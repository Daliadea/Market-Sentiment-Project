import { OHLCData, BacktestResults } from '../types/trading';

/**
 * Generates mock OHLC (candlestick) data for a given date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @param basePrice - Starting price for the stock (default: 150)
 * @returns Array of OHLC data points
 */
export function generateMockOHLCData(
  startDate: string,
  endDate: string,
  basePrice: number = 150
): OHLCData[] {
  const data: OHLCData[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let currentPrice = basePrice;
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Generate realistic OHLC data with some randomness
      const volatility = 0.02; // 2% daily volatility
      const trend = (Math.random() - 0.48) * 0.01; // Slight upward bias
      
      const open = currentPrice;
      const change = open * (trend + (Math.random() - 0.5) * volatility);
      const close = open + change;
      
      // High and low based on open and close
      const maxMove = Math.abs(change) * 2;
      const high = Math.max(open, close) + Math.random() * maxMove;
      const low = Math.min(open, close) - Math.random() * maxMove;
      
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      
      data.push({
        time: currentDate.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
      });
      
      currentPrice = close;
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

/**
 * Generates mock backtest results
 * @param ticker - Stock ticker symbol
 * @param data - OHLC data to base results on
 * @returns Mock backtest results
 */
export function generateMockBacktestResults(
  ticker: string,
  data: OHLCData[]
): BacktestResults {
  if (data.length === 0) {
    return {
      totalReturn: 0,
      maxDrawdown: 0,
      winRate: 0,
      trades: 0,
      profitableTrades: 0,
    };
  }
  
  const startPrice = data[0].close;
  const endPrice = data[data.length - 1].close;
  const totalReturn = ((endPrice - startPrice) / startPrice) * 100;
  
  // Calculate mock max drawdown
  let peak = startPrice;
  let maxDrawdown = 0;
  
  data.forEach(candle => {
    if (candle.high > peak) {
      peak = candle.high;
    }
    const drawdown = ((peak - candle.low) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  // Generate mock trading statistics
  const trades = Math.floor(data.length / 5); // Trade every 5 days on average
  const winRate = 50 + (totalReturn > 0 ? 10 : -10) + Math.random() * 10; // 50-70% if profitable
  const profitableTrades = Math.floor(trades * (winRate / 100));
  
  return {
    totalReturn: parseFloat(totalReturn.toFixed(2)),
    maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
    winRate: parseFloat(winRate.toFixed(2)),
    trades,
    profitableTrades,
  };
}

/**
 * Simulates an API call to fetch OHLC data
 * @param ticker - Stock ticker symbol
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Promise with OHLC data
 */
export async function fetchOHLCData(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<OHLCData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock data
  const basePrice = 100 + Math.random() * 200; // Random starting price between 100-300
  return generateMockOHLCData(startDate, endDate, basePrice);
}

/**
 * Simulates an API call to run a backtest
 * @param ticker - Stock ticker symbol
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Promise with backtest results
 */
export async function runBacktest(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<{ data: OHLCData[]; results: BacktestResults }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const data = await fetchOHLCData(ticker, startDate, endDate);
  const results = generateMockBacktestResults(ticker, data);
  
  return { data, results };
}

