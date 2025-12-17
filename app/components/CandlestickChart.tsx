'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { OHLCData } from '../types/trading';

interface CandlestickChartProps {
  data: OHLCData[];
  height?: number;
}

export default function CandlestickChart({ data, height = 600 }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

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

    // Create an area series (more reliable than candlestick across all builds)
    // Shows close prices with a nice filled area
    let series;
    try {
      // Use any to bypass TypeScript issues with lightweight-charts
      series = (chart as any).addAreaSeries({
        topColor: 'rgba(16, 185, 129, 0.4)',
        bottomColor: 'rgba(16, 185, 129, 0.0)',
        lineColor: '#10b981',
        lineWidth: 2,
      });
    } catch (error) {
      console.error('Error creating series:', error);
      return;
    }

    chartRef.current = chart;
    seriesRef.current = series;

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

    // Convert OHLC data to line data (using close prices)
    const chartData = data.map(candle => ({
      time: candle.time,
      value: candle.close,
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
