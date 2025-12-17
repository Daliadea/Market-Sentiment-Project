# Trading Strategy Backtester

Web app for testing out trading strategies on historical stock data. Threw this together with Next.js 14, TypeScript, and TradingView's charting library because I wanted something clean to visualize backtests.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwind-css)

## What it does

- Renders candlestick charts using TradingView's lightweight-charts (super smooth, no lag)
- **Pulls real market data from Finnhub API** (with demo mode fallback)
- Dark theme that won't burn your eyes during late night trading sessions
- Shows backtest metrics: total return, max drawdown, win rate, etc.
- Works on mobile too (responsive design)
- Toggle between live data and demo mode with one click

## Design

Went for that terminal/Bloomberg vibe:
- Dark slate backgrounds
- Green for gains, red for losses (the universal language)
- Monospace fonts for all the numbers (JetBrains Mono)
- Minimal UI, focuses on the chart

## Stack

- Next.js 14 (using the new App Router)
- TypeScript
- TailwindCSS 4
- TradingView Lightweight Charts
- date-fns

## Getting Started

```bash
# clone it
git clone https://github.com/Daliadea/Market-Sentiment-Project.git
cd Market-Sentiment-Project

# install stuff
npm install

# add your API keys (optional - works without them in demo mode)
# create .env.local and add:
# NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here

# run it
npm run dev
```

Open http://localhost:3000 and you should see the dashboard.

**Note:** The app works out of the box! If you don't add API keys, it uses demo data. Add a Finnhub API key to get real market data.

## How it's organized

```
app/
├── components/
│   ├── CandlestickChart.tsx    # the chart
│   └── ControlPanel.tsx        # sidebar controls & results
├── types/
│   └── trading.ts              # typescript interfaces
├── utils/
│   └── mockData.ts             # generates fake OHLC data
├── page.tsx                    # main dashboard
└── globals.css                 # styles
```

## Key pieces

**CandlestickChart** - Wraps the TradingView chart library. Handles resizing, custom colors, and all the chart interactions.

**ControlPanel** - The sidebar where you input ticker symbols, pick date ranges, and see backtest results. Has loading states and everything.

**Mock Data Generator** - Creates realistic OHLC data so you can test without API keys. Has functions like `generateMockOHLCData()` and `runBacktest()` that you can swap out for real API calls later.

## Using it

1. Type in a ticker (AAPL, TSLA, NVDA, whatever)
2. Pick your date range
3. Hit "Run Backtest"
4. Watch the chart load with real candlestick data
5. Toggle between real data and demo mode with the button in the header

**Real Data:** Uses Finnhub API to fetch actual historical stock prices
**Demo Mode:** Generates realistic mock data if you don't have API keys

## Getting API Keys

**Finnhub** (for stock data):
1. Sign up at https://finnhub.io/
2. Get your free API key
3. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_FINNHUB_API_KEY=your_key_here
   ```

Free tier gives you 60 API calls/minute, which is plenty for testing.

## Customizing

Colors are in `app/globals.css`:
```css
:root {
  --background: #0f172a;
  --profit: #10b981;      /* green for gains */
  --loss: #f43f5e;        /* red for losses */
}
```

Chart settings in `app/components/CandlestickChart.tsx` if you want to tweak the appearance.

## TODO

Stuff I might add later:
- Hook up to real market data (Alpha Vantage or Yahoo Finance API)
- Multiple strategy comparison
- More technical indicators (RSI, MACD, moving averages)
- Export results to CSV
- Save strategies
- User accounts

## Contributing

Found a bug or want to add something? PRs are welcome.

---

Built with Next.js and TradingView's chart library
