import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { ticker } = await request.json();

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    // Step 1: Fetch news from Finnhub
    const newsData = await fetchFinnhubNews(ticker);
    
    if (!newsData || newsData.length === 0) {
      return NextResponse.json(
        { error: 'No news available for this ticker' },
        { status: 404 }
      );
    }

    // Step 2: Analyze with Gemini AI
    const analysis = await analyzeWithGemini(ticker, newsData);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error in fundamental analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze' },
      { status: 500 }
    );
  }
}

async function fetchFinnhubNews(ticker: string) {
  if (!FINNHUB_API_KEY) {
    throw new Error('Finnhub API key not configured');
  }

  // Get date range for last 30 days
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

  const toStr = to.toISOString().split('T')[0];
  const fromStr = from.toISOString().split('T')[0];

  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromStr}&to=${toStr}&token=${FINNHUB_API_KEY}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch news from Finnhub');
  }

  const news = await response.json();
  
  // Return top 15 most recent articles
  return news.slice(0, 15);
}

async function analyzeWithGemini(ticker: string, newsArticles: any[]) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Prepare news headlines for analysis
  const headlines = newsArticles.map((article, i) => 
    `${i + 1}. ${article.headline} (${new Date(article.datetime * 1000).toLocaleDateString()})`
  ).join('\n');

  const prompt = `You are a Senior Equity Analyst. Analyze these recent news headlines for ${ticker}.

NEWS HEADLINES:
${headlines}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no explanation):
{
  "sentiment_score": <number 0-100>,
  "sentiment_summary": "<1 sentence explaining the overall market sentiment>",
  "fair_value_estimate": "<Extract any price target range mentioned (e.g., $450-$480). If none found, write 'N/A'>",
  "leading_indicators": [
    {
      "name": "<Key metric relevant to ${ticker} (e.g., for MSFT: 'Cloud Revenue Growth')>",
      "status": "<Bullish|Neutral|Bearish>",
      "reason": "<Why? Brief explanation>"
    },
    {
      "name": "<Another key metric>",
      "status": "<Bullish|Neutral|Bearish>",
      "reason": "<Why?>"
    },
    {
      "name": "<Third key metric>",
      "status": "<Bullish|Neutral|Bearish>",
      "reason": "<Why?>"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. No markdown code blocks, no explanations outside the JSON.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean up response (remove markdown code blocks if present)
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/```\n?/g, '');
  }
  
  // Parse JSON response
  const analysis = JSON.parse(cleanText);
  
  return analysis;
}

