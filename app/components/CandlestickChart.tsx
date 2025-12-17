'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { OHLCData } from '../types/trading';

interface CandlestickChartProps {
  data: OHLCData[];
  height?: number;
}

export default function CandlestickChart({ data, height = 600 }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#475569',
          width: 1,
          style: 2,
          labelBackgroundColor: '#334155',
        },
        horzLine: {
          color: '#475569',
          width: 1,
          style: 2,
          labelBackgroundColor: '#334155',
        },
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series with type assertion
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    }) as ISeriesApi<'Candlestick'>;

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || data.length === 0) return;

    // Convert data to lightweight-charts format
    const chartData: CandlestickData[] = data.map(candle => ({
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    seriesRef.current.setData(chartData);

    // Fit content to view
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
