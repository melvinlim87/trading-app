'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
  data?: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }>;
}

export default function TradingChart({ symbol, data }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0e27' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1e2235' },
        horzLines: { color: '#1e2235' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Generate sample data if none provided
    const chartData = data || generateSampleData();
    candlestickSeries.setData(chartData as any);

    // Fit content
    chart.timeScale().fitContent();

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
      chart.remove();
    };
  }, [data]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{symbol}</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-secondary rounded hover:bg-secondary/80">1D</button>
          <button className="px-3 py-1 text-sm bg-secondary rounded hover:bg-secondary/80">1W</button>
          <button className="px-3 py-1 text-sm bg-secondary rounded hover:bg-secondary/80">1M</button>
          <button className="px-3 py-1 text-sm bg-secondary rounded hover:bg-secondary/80">1Y</button>
        </div>
      </div>
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden border border-border" />
    </div>
  );
}

// Generate sample candlestick data
function generateSampleData() {
  const data = [];
  const basePrice = 150;
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = 100; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const open = currentPrice;
    const change = (Math.random() - 0.5) * 5;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    currentPrice = close;
  }

  return data;
}
