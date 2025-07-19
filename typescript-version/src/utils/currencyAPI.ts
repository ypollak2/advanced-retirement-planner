// Currency Exchange Rate API - TypeScript Implementation
// Created by Yali Pollak (יהלי פולק) - v6.0.0-beta.1

import {
  Currency,
  Language,
  type ExchangeRates,
  type ConversionResult,
  type CurrencyConversionError,
} from '@/types';

interface APIEndpoint {
  readonly name: string;
  readonly url: string | null;
  readonly parse: (data: unknown) => ExchangeRates;
}

interface CacheStatus {
  readonly isValid: boolean;
  readonly lastUpdated: number | null;
  readonly cacheSize: number;
  readonly timeToExpiry: number;
}

interface CurrencySymbols {
  readonly [key in Currency]: string;
}

export class CurrencyAPI {
  private readonly cache = new Map<Currency, number>();
  private lastUpdated: number | null = null;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private readonly fallbackRates: Readonly<Record<Currency, number>> = {
    [Currency.ILS]: 1,
    [Currency.USD]: 3.7,
    [Currency.GBP]: 4.65,
    [Currency.EUR]: 4.02,
    [Currency.BTC]: 0.0000025, // ~40,000 USD per BTC
    [Currency.ETH]: 0.00035, // ~2,850 USD per ETH
  } as const;

  private readonly currencySymbols: CurrencySymbols = {
    [Currency.ILS]: '₪',
    [Currency.USD]: '$',
    [Currency.GBP]: '£',
    [Currency.EUR]: '€',
    [Currency.BTC]: '₿',
    [Currency.ETH]: 'Ξ',
  } as const;

  private readonly apiEndpoints: readonly APIEndpoint[] = [
    {
      name: 'ExchangeRate-API',
      url: 'https://api.exchangerate-api.com/v4/latest/ILS',
      parse: (data: unknown): ExchangeRates => {
        const typedData = data as { rates: Record<string, number> };
        const rates = typedData.rates;
        return {
          [Currency.USD]: 1 / (rates.USD || 0.27),
          [Currency.EUR]: 1 / (rates.EUR || 0.25),
          [Currency.GBP]: 1 / (rates.GBP || 0.22),
        };
      },
    },
    {
      name: 'CoinGecko-Fiat',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=usd,eur,gbp&vs_currencies=ils',
      parse: (data: unknown): ExchangeRates => {
        const typedData = data as {
          usd?: { ils: number };
          eur?: { ils: number };
          gbp?: { ils: number };
        };
        return {
          [Currency.USD]: typedData.usd?.ils || 3.7,
          [Currency.EUR]: typedData.eur?.ils || 4.0,
          [Currency.GBP]: typedData.gbp?.ils || 4.6,
        };
      },
    },
    {
      name: 'CoinGecko-Crypto',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=ils',
      parse: (data: unknown): ExchangeRates => {
        const typedData = data as {
          bitcoin?: { ils: number };
          ethereum?: { ils: number };
        };
        return {
          [Currency.BTC]: 1 / (typedData.bitcoin?.ils || 150000),
          [Currency.ETH]: 1 / (typedData.ethereum?.ils || 10000),
        };
      },
    },
    {
      name: 'Fallback-Priority',
      url: null,
      parse: (): ExchangeRates => this.fallbackRates,
    },
  ] as const;

  /**
   * Check if cache is valid based on timeout
   */
  private isCacheValid(): boolean {
    return (
      this.lastUpdated !== null &&
      Date.now() - this.lastUpdated < this.cacheTimeout
    );
  }

  /**
   * Get cached rates if valid, otherwise return null
   */
  public getCachedRates(): ExchangeRates | null {
    if (this.isCacheValid() && this.cache.size > 0) {
      return Object.fromEntries(this.cache) as ExchangeRates;
    }
    return null;
  }

  /**
   * Fetch exchange rates from a single API endpoint
   */
  private async fetchFromEndpoint(endpoint: APIEndpoint): Promise<ExchangeRates | null> {
    if (endpoint.url === null) {
      return endpoint.parse({});
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: unknown = await response.json();
      return endpoint.parse(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`CurrencyAPI: ${endpoint.name} failed:`, errorMessage);
      return null;
    }
  }

  /**
   * Fetch exchange rates with fallback system (CORS-safe version)
   */
  public async fetchExchangeRates(): Promise<ExchangeRates> {
    // Check cache first
    const cachedRates = this.getCachedRates();
    if (cachedRates !== null) {
      return cachedRates;
    }

    // Always use fallback rates to avoid CORS issues in production
    console.log('CurrencyAPI: Using fallback rates (API calls disabled to prevent CORS errors)');
    
    const rates: ExchangeRates = {
      [Currency.USD]: 3.7, // 1 ILS = 0.27 USD
      [Currency.EUR]: 4.02, // 1 ILS = 0.25 EUR
      [Currency.GBP]: 4.65, // 1 ILS = 0.21 GBP
      [Currency.BTC]: 150000, // 1 ILS = 0.0000067 BTC (Bitcoin ~$45k)
      [Currency.ETH]: 10000, // 1 ILS = 0.0001 ETH (Ethereum ~$3k)
    };

    // Update cache
    this.cache.clear();
    Object.entries(rates).forEach(([currency, rate]) => {
      this.cache.set(currency as Currency, rate);
    });
    this.lastUpdated = Date.now();

    console.log('CurrencyAPI: Updated rates using fallback values');
    return rates;
  }

  /**
   * Get exchange rate between two currencies
   */
  public async getRate(fromCurrency: Currency, toCurrency: Currency = Currency.ILS): Promise<number> {
    const rates = await this.fetchExchangeRates();

    if (fromCurrency === toCurrency) return 1;
    if (fromCurrency === Currency.ILS) return rates[toCurrency] || 1;
    if (toCurrency === Currency.ILS) return 1 / (rates[fromCurrency] || 1);

    // Cross currency conversion (e.g., USD to EUR)
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    return toRate / fromRate;
  }

  /**
   * Convert amount between currencies with detailed result
   */
  public async convertAmount(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency = Currency.ILS
  ): Promise<ConversionResult> {
    if (amount < 0) {
      throw new CurrencyConversionError(
        'Amount cannot be negative',
        fromCurrency,
        toCurrency
      );
    }

    const rate = await this.getRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      rate,
      timestamp: new Date(),
    };
  }

  /**
   * Simple amount conversion (backward compatibility)
   */
  public async convertAmountSimple(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency = Currency.ILS
  ): Promise<number> {
    const result = await this.convertAmount(amount, fromCurrency, toCurrency);
    return result.convertedAmount;
  }

  /**
   * Format currency with proper symbol and locale-aware formatting
   */
  public formatCurrency(
    amount: number,
    currency: Currency = Currency.ILS,
    language: Language = Language.HE
  ): string {
    const symbol = this.currencySymbols[currency];
    const locale = language === Language.HE ? 'he-IL' : 'en-US';

    if (currency === Currency.BTC || currency === Currency.ETH) {
      return `${symbol}${amount.toFixed(6)}`;
    }

    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${symbol}${formatter.format(Math.round(amount))}`;
    } catch (error) {
      console.warn('Currency formatting failed, using fallback:', error);
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
  }

  /**
   * Get currency symbol for a given currency
   */
  public getCurrencySymbol(currency: Currency): string {
    return this.currencySymbols[currency];
  }

  /**
   * Get last update timestamp
   */
  public getLastUpdated(): number | null {
    return this.lastUpdated;
  }

  /**
   * Force refresh rates by clearing cache
   */
  public async forceRefresh(): Promise<ExchangeRates> {
    this.cache.clear();
    this.lastUpdated = null;
    return await this.fetchExchangeRates();
  }

  /**
   * Get detailed cache status information
   */
  public getCacheStatus(): CacheStatus {
    return {
      isValid: this.isCacheValid(),
      lastUpdated: this.lastUpdated,
      cacheSize: this.cache.size,
      timeToExpiry: this.lastUpdated
        ? Math.max(0, this.cacheTimeout - (Date.now() - this.lastUpdated))
        : 0,
    };
  }

  /**
   * Get all supported currencies
   */
  public getSupportedCurrencies(): readonly Currency[] {
    return Object.values(Currency);
  }

  /**
   * Check if a currency is supported
   */
  public isCurrencySupported(currency: string): currency is Currency {
    return Object.values(Currency).includes(currency as Currency);
  }
}

// Create and export singleton instance
export const currencyAPI = new CurrencyAPI();

// Default export for convenience
export default currencyAPI;

// Error class for currency conversion errors
export class CurrencyConversionError extends Error {
  constructor(
    message: string,
    public readonly fromCurrency: Currency,
    public readonly toCurrency: Currency
  ) {
    super(message);
    this.name = 'CurrencyConversionError';
  }
}

// Initialize rates when module loads (if in browser environment)
if (typeof window !== 'undefined') {
  // Make available globally for backward compatibility
  (window as any).CurrencyAPI = CurrencyAPI;
  (window as any).currencyAPI = currencyAPI;

  // Backward compatibility functions
  (window as any).fetchExchangeRates = (): Promise<ExchangeRates> =>
    currencyAPI.fetchExchangeRates();
  
  (window as any).convertCurrency = (
    amount: number,
    from: Currency,
    to: Currency
  ): Promise<number> => currencyAPI.convertAmountSimple(amount, from, to);
  
  (window as any).formatCurrencyAmount = (
    amount: number,
    currency: Currency,
    language: Language
  ): string => currencyAPI.formatCurrency(amount, currency, language);
  
  (window as any).getCurrencyRate = (
    from: Currency,
    to: Currency
  ): Promise<number> => currencyAPI.getRate(from, to);

  // Initialize rates on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      currencyAPI.fetchExchangeRates().catch((error: unknown) => {
        console.warn('Initial currency rate fetch failed:', error);
      });
    });
  } else {
    // DOM already loaded
    currencyAPI.fetchExchangeRates().catch((error: unknown) => {
      console.warn('Initial currency rate fetch failed:', error);
    });
  }

  console.log('CurrencyAPI v6.0.0-beta.1 loaded successfully');
}