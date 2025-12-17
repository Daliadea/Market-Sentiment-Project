# 🚀 Vercel Deployment & API Setup

## Quick Fix for Your Current Issue

Your app is deployed but needs API keys added to Vercel. Here's how:

### Step 1: Add Environment Variables to Vercel

1. **Go to your Vercel dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project: **market-sentiment-project**

2. **Navigate to Settings:**
   - Click the **"Settings"** tab at the top
   - Click **"Environment Variables"** in the left sidebar

3. **Add your Finnhub API key:**
   ```
   Name: NEXT_PUBLIC_FINNHUB_API_KEY
   Value: [YOUR_FINNHUB_API_KEY]
   Environment: Production, Preview, Development (check all)
   ```
   Click **"Save"**

4. **Add your Gemini API key (optional, for future features):**
   ```
   Name: NEXT_PUBLIC_GEMINI_API_KEY
   Value: [YOUR_GEMINI_API_KEY]
   Environment: Production, Preview, Development (check all)
   ```
   Click **"Save"**

### Step 2: Redeploy

After adding the environment variables:

**Option 1: Automatic (Recommended)**
- The latest push will trigger a new deployment automatically
- Wait 1-2 minutes for the build to complete

**Option 2: Manual**
- Go to the **"Deployments"** tab
- Click the **"..."** menu on the latest deployment
- Click **"Redeploy"**

### Step 3: Test

Visit your app: **https://market-sentiment-project.vercel.app/**

Try:
1. Enter ticker: **AAPL**
2. Date range: **2024-01-01** to **2024-12-16**
3. Click **"Run Backtest"**

You should now see real candlestick data! 📊

---

## What Was Fixed

### 1. Chart Rendering Issue ✅
- Fixed the `addCandlestickSeries` error
- Chart now works in production

### 2. API Key Configuration 📝
- Need to add keys in Vercel dashboard
- Won't work until you complete Step 1 above

---

## Current Status

✅ Code pushed to GitHub  
✅ Chart rendering fixed  
⏳ Waiting for you to add API keys to Vercel  
⏳ Vercel will auto-deploy in ~2 minutes

---

## Testing Locally

To test with real API keys locally:

```bash
# Make sure .env.local exists
cd C:\Users\aiken\trading-backtester
npm run dev
```

Open http://localhost:3000 - should work perfectly with real data!

---

## Troubleshooting

**Still seeing "demo data" message?**
- Double-check you added `NEXT_PUBLIC_FINNHUB_API_KEY` (not just `FINNHUB_API_KEY`)
- Make sure you selected all environments (Production, Preview, Development)
- Wait for the deployment to finish

**Chart still not showing?**
- Clear your browser cache
- Try incognito/private mode
- Check browser console for errors

**Rate limit errors?**
- Finnhub free tier: 60 calls/minute
- Wait a minute and try again

---

## Getting Your API Keys

**Finnhub** (Stock data):
- Sign up: https://finnhub.io/register
- Get free API key from dashboard
- Free tier: 60 API calls/minute
- Docs: https://finnhub.io/docs/api

**Gemini** (AI features, for future use):
- Get key: https://console.cloud.google.com/apis/credentials
- Ready for future sentiment analysis features

---

## Screenshots Guide

### Adding Environment Variables:

1. Vercel Dashboard → Your Project → Settings
2. Environment Variables (left sidebar)
3. Add Variable:
   - Key: `NEXT_PUBLIC_FINNHUB_API_KEY`
   - Value: (paste your key)
   - Environments: ✓ All
4. Save

That's it! Vercel will rebuild automatically. 🎉

