// context/CryptoContext.js
import { createContext, useCallback, useEffect, useRef, useState } from 'react';

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const updateIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const POPULAR_CRYPTOS = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
    'ADAUSDT', 'DOGEUSDT', 'MATICUSDT', 'DOTUSDT', 'LTCUSDT'
  ];

  // Fetch market data with error handling
  const fetchMarketData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (!marketData.length) {
      setLoading(true);
    }

    try {
      const promises = POPULAR_CRYPTOS.map(symbol =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching ${symbol}:`, err);
            return null;
          })
      );

      const results = await Promise.all(promises);
      
      if (!isMountedRef.current) return;

      const formatted = results
        .filter(item => item !== null)
        .map(item => ({
          symbol: item.symbol,
          price: parseFloat(item.lastPrice) || 0,
          change: parseFloat(item.priceChangePercent) || 0,
          high: parseFloat(item.highPrice) || 0,
          low: parseFloat(item.lowPrice) || 0,
          volume: parseFloat(item.volume) || 0,
          openPrice: parseFloat(item.openPrice) || 0,
          quoteVolume: parseFloat(item.quoteVolume) || 0,
          trades: parseInt(item.count) || 0,
        }));

      setMarketData(formatted);
      setLastUpdated(new Date());
      setError(null);

    } catch (err) {
      console.error('Market fetch error:', err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [marketData.length]);

  // Search for cryptocurrencies with enhanced features
  const searchCrypto = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      const data = await response.json();

      const usdtPairs = data.symbols
        .filter(s => s.symbol.endsWith('USDT') && s.status === 'TRADING')
        .map(s => ({
          symbol: s.symbol,
          baseAsset: s.baseAsset,
          name: s.baseAsset
        }))
        .filter(s =>
          s.baseAsset.toLowerCase().includes(query.toLowerCase()) ||
          s.symbol.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 15);

      // Fetch prices for search results
      const pricesPromises = usdtPairs.map(pair =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair.symbol}`)
          .then(res => res.json())
          .catch(() => null)
      );

      const prices = await Promise.all(pricesPromises);

      return usdtPairs.map((pair, idx) => {
        const priceData = prices[idx];
        return {
          ...pair,
          price: priceData ? parseFloat(priceData.lastPrice) : 0,
          change: priceData ? parseFloat(priceData.priceChangePercent) : 0,
          high: priceData ? parseFloat(priceData.highPrice) : 0,
          low: priceData ? parseFloat(priceData.lowPrice) : 0,
          volume: priceData ? parseFloat(priceData.volume) : 0,
        };
      });

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }, []);

  // Get specific crypto data
  const getCryptoData = useCallback((symbol) => {
    return marketData.find(crypto => crypto.symbol === symbol);
  }, [marketData]);

  // Get top gainers
  const getTopGainers = useCallback((limit = 5) => {
    return [...marketData]
      .sort((a, b) => b.change - a.change)
      .slice(0, limit);
  }, [marketData]);

  // Get top losers
  const getTopLosers = useCallback((limit = 5) => {
    return [...marketData]
      .sort((a, b) => a.change - b.change)
      .slice(0, limit);
  }, [marketData]);

  // Get highest volume
  const getHighestVolume = useCallback((limit = 5) => {
    return [...marketData]
      .sort((a, b) => b.quoteVolume - a.quoteVolume)
      .slice(0, limit);
  }, [marketData]);

  // Filter by criteria
  const filterCryptos = useCallback((criteria) => {
    return marketData.filter(crypto => {
      if (criteria.minPrice && crypto.price < criteria.minPrice) return false;
      if (criteria.maxPrice && crypto.price > criteria.maxPrice) return false;
      if (criteria.minChange && crypto.change < criteria.minChange) return false;
      if (criteria.maxChange && crypto.change > criteria.maxChange) return false;
      return true;
    });
  }, [marketData]);

  // Refresh manually
  const refresh = useCallback(() => {
    return fetchMarketData(true);
  }, [fetchMarketData]);

  // Initial fetch and setup interval
  useEffect(() => {
    isMountedRef.current = true;
    fetchMarketData();

    // Update every 4 seconds
    updateIntervalRef.current = setInterval(() => {
      fetchMarketData();
    }, 4000);

    return () => {
      isMountedRef.current = false;
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [fetchMarketData]);

  const contextValue = {
    // Data
    marketData,
    loading,
    refreshing,
    error,
    lastUpdated,
    
    // Functions
    searchCrypto,
    getCryptoData,
    getTopGainers,
    getTopLosers,
    getHighestVolume,
    filterCryptos,
    refresh,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
};