# 🚀 Quick Start Guide

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account

### Installation & Running Locally

1. **Clone the repository** (after pushing to GitHub):
```bash
git clone https://github.com/YOUR_USERNAME/trading-backtester.git
cd trading-backtester
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage Guide

### Running a Backtest

1. **Enter a Ticker Symbol**: Type any stock symbol (e.g., AAPL, GOOGL, TSLA, MSFT)
2. **Select Date Range**: 
   - Start Date: Choose the beginning of your backtest period
   - End Date: Choose the end of your backtest period
3. **Click "Run Backtest"**: The system will generate mock data and display results
4. **Analyze the Results**:
   - **Candlestick Chart**: View the price action over the selected period
   - **Total Return**: Overall percentage gain or loss
   - **Max Drawdown**: Largest peak-to-trough decline
   - **Win Rate**: Percentage of profitable trades
   - **Total Trades**: Number of trades executed
   - **Profitable Trades**: Count of winning trades

### Chart Interactions

- **Zoom**: Scroll or pinch to zoom in/out
- **Pan**: Click and drag to move along the time axis
- **Crosshair**: Hover over the chart to see exact OHLC values
- **Auto-fit**: The chart automatically fits content when new data is loaded

## Project Structure

```
trading-backtester/
├── app/
│   ├── components/           # React components
│   │   ├── CandlestickChart.tsx    # Chart component using lightweight-charts
│   │   └── ControlPanel.tsx        # Control panel for inputs and results
│   ├── types/                # TypeScript type definitions
│   │   └── trading.ts        # Trading-related types
│   ├── utils/                # Utility functions
│   │   └── mockData.ts       # Mock data generator and API structure
│   ├── layout.tsx            # Root layout with fonts
│   ├── page.tsx              # Main dashboard page
│   └── globals.css           # Global styles and Tailwind config
├── public/                   # Static assets
├── README.md                 # Full documentation
├── QUICKSTART.md            # This file
└── GITHUB_SETUP.md          # GitHub setup instructions
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS 4**: Utility-first CSS framework
- **Lightweight Charts**: High-performance charting library by TradingView
- **date-fns**: Date manipulation utilities

## Customization

### Changing Colors

Edit `app/globals.css`:
```css
:root {
  --background: #0f172a;    /* Main background */
  --foreground: #e2e8f0;    /* Text color */
  --profit: #10b981;        /* Profit/up color */
  --loss: #f43f5e;          /* Loss/down color */
}
```

### Modifying Mock Data

Edit `app/utils/mockData.ts` to change:
- Volatility: Adjust the `volatility` constant
- Trend: Modify the `trend` calculation
- Date range behavior
- Starting prices

### Adding Real API Integration

Replace the mock functions in `app/utils/mockData.ts` with real API calls:

```typescript
export async function fetchOHLCData(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<OHLCData[]> {
  const response = await fetch(`YOUR_API_URL/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker, startDate, endDate }),
  });
  
  return await response.json();
}
```

## Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Chart Not Displaying

- Check browser console for errors
- Ensure data format matches `OHLCData` interface
- Verify dates are in 'YYYY-MM-DD' format

### Performance Issues

- Reduce the date range for fewer data points
- Check for console warnings about re-renders
- Clear browser cache

## Development Tips

### Hot Reload
Changes to code automatically reload in development mode (`npm run dev`)

### TypeScript Checking
Run type checking without building:
```bash
npx tsc --noEmit
```

### Linting
Check code quality:
```bash
npm run lint
```

## Next Steps

1. **Deploy to Vercel**: 
   - Push to GitHub
   - Import to Vercel
   - Automatic deployments on every push

2. **Add Features**:
   - Technical indicators (RSI, MACD, Moving Averages)
   - Multiple strategy comparison
   - Export results to CSV
   - Save/load strategies

3. **Connect Backend**:
   - Build FastAPI backend for real data
   - Implement actual backtesting algorithms
   - Add authentication

## Support

For issues or questions:
- Check the main [README.md](README.md)
- Review [GITHUB_SETUP.md](GITHUB_SETUP.md) for Git/GitHub help
- Open an issue on GitHub

---

Happy Trading! 📈

