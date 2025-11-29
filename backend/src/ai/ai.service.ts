import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async analyzeTicker(symbol: string, timeframe: string = '1D') {
    if (!this.openai) {
      return {
        error: 'OpenAI API key not configured',
        fallback: this.getFallbackAnalysis(symbol),
      };
    }

    try {
      const prompt = `Provide a brief technical analysis for ${symbol} on ${timeframe} timeframe. Include:
1. Trend direction
2. Key support/resistance levels
3. Volatility assessment
4. Risk factors
Keep it concise (max 150 words) and educational.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a financial analyst assistant. Provide educational analysis only, not investment advice.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
      });

      return {
        symbol,
        timeframe,
        analysis: completion.choices[0].message.content,
        disclaimer:
          'This is educational content only, not investment advice.',
      };
    } catch (error) {
      return {
        error: 'Failed to generate analysis',
        fallback: this.getFallbackAnalysis(symbol),
      };
    }
  }

  async suggestOptionsStrategy(params: {
    outlook: 'bullish' | 'bearish' | 'neutral';
    riskTolerance: 'low' | 'medium' | 'high';
    symbol: string;
  }) {
    const { outlook, riskTolerance, symbol } = params;

    // Fallback strategy suggestions
    const strategies = {
      bullish: {
        low: 'Covered Call - Generate income while holding stock',
        medium: 'Bull Call Spread - Limited risk, limited reward',
        high: 'Long Call - Maximum upside potential',
      },
      bearish: {
        low: 'Cash-Secured Put - Generate income with downside protection',
        medium: 'Bear Put Spread - Limited risk, limited reward',
        high: 'Long Put - Maximum downside profit potential',
      },
      neutral: {
        low: 'Iron Condor - Profit from low volatility',
        medium: 'Straddle - Profit from high volatility',
        high: 'Calendar Spread - Time decay strategy',
      },
    };

    const suggestion = strategies[outlook][riskTolerance];

    return {
      symbol,
      outlook,
      riskTolerance,
      suggestion,
      disclaimer:
        'Options trading involves significant risk. This is educational content only.',
    };
  }

  async analyzePortfolio(positions: any[]) {
    const sectors = {};
    const assetTypes = {};
    let totalValue = 0;

    positions.forEach((pos) => {
      const value = pos.quantity * pos.avgPrice;
      totalValue += value;

      // Simplified sector classification
      const sector = 'Technology'; // Would need real sector data
      sectors[sector] = (sectors[sector] || 0) + value;

      const type = pos.instrument.type;
      assetTypes[type] = (assetTypes[type] || 0) + value;
    });

    // Calculate concentrations
    const sectorConcentration = Object.entries(sectors).map(
      ([sector, value]: [string, any]) => ({
        sector,
        percentage: ((value / totalValue) * 100).toFixed(2),
      }),
    );

    const insights = [];

    // Check for over-concentration
    sectorConcentration.forEach((item) => {
      if (parseFloat(item.percentage) > 40) {
        insights.push(
          `High concentration in ${item.sector} (${item.percentage}%). Consider diversification.`,
        );
      }
    });

    return {
      totalValue,
      sectorConcentration,
      assetTypes,
      insights,
      recommendation:
        insights.length > 0
          ? 'Consider rebalancing your portfolio for better diversification.'
          : 'Your portfolio shows good diversification.',
    };
  }

  private getFallbackAnalysis(symbol: string) {
    return {
      symbol,
      analysis: `Technical analysis for ${symbol} is currently unavailable. Please check back later or consult with a financial advisor.`,
      disclaimer: 'This is educational content only, not investment advice.',
    };
  }
}
