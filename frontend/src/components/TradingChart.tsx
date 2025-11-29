'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { fetchCryptoHistory, fetchStockHistory, timeframeToDays, CandleData } from '@/lib/market-data';

interface TradingChartProps {
  symbol: string;
  assetType?: 'crypto' | 'stocks';
  data?: CandleData[];
}

export default function TradingChart({ symbol, assetType = 'crypto', data }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real market data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const days = timeframeToDays(timeframe);
        let historicalData: CandleData[];
        
        if (assetType === 'crypto') {
          historicalData = await fetchCryptoHistory(symbol, days);
        } else {
          const interval = days <= 7 ? 'daily' : days <= 90 ? 'daily' : 'weekly';
          historicalData = await fetchStockHistory(symbol, interval);
        }
        
        setChartData(historicalData);
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [symbol, timeframe, assetType]);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

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

    // Use fetched data
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
  }, [chartData]);

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{symbol}</h3>
          {loading && <p className="text-xs text-muted-foreground">Loading data...</p>}
        </div>
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                timeframe === tf
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden border border-border" />
    </div>
  );
}
