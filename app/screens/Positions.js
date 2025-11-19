// Positions.js
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axiosInstance from '../api/axiosInstance';

const SYMBOL_INFO = {
  AAPL: { name: 'Apple Inc.', image: 'https://logo.clearbit.com/apple.com' },
  TSLA: { name: 'Tesla, Inc.', image: 'https://logo.clearbit.com/tesla.com' },
  BTC: { name: 'Bitcoin', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  ETH: { name: 'Ethereum', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  NIFTY: { name: 'NIFTY 50', image: null },
  INFY: { name: 'Infosys Ltd.', image: 'https://logo.clearbit.com/infosys.com' },
  // add more if needed
};

const STOCK_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
  'ADAUSDT', 'DOGEUSDT', 'MATICUSDT', 'DOTUSDT', 'LTCUSDT'
];

// Static mock positions
const MOCK_POSITIONS = [
  // Markets (equities / crypto)
  {
    id: 'p1',
    symbol: 'AAPL',
    type: 'MARKET',
    qty: 12,
    avgBuyPrice: 145.0,
    currentPrice: 168.25,
    exchange: 'NASDAQ',
  },
  {
    id: 'p2',
    symbol: 'TSLA',
    type: 'MARKET',
    qty: 3,
    avgBuyPrice: 720.5,
    currentPrice: 789.1,
    exchange: 'NASDAQ',
  },
  {
    id: 'p3',
    symbol: 'BTC',
    type: 'MARKET',
    qty: 0.052,
    avgBuyPrice: 36000,
    currentPrice: 47000,
    exchange: 'BINANCE',
  },

  // Options (simplified representation)
  {
    id: 'o1',
    symbol: 'AAPL 20NOV25 C 170',
    type: 'OPTION',
    qty: 2, // contracts
    avgBuyPrice: 2.8, // premium per contract in USD
    currentPrice: 3.6, // current premium
    underlying: 'AAPL',
    expiry: '2025-11-20',
    strike: 170,
    optionSide: 'CALL',
  },
  {
    id: 'o2',
    symbol: 'INFY 26DEC25 P 1200',
    type: 'OPTION',
    qty: 1,
    avgBuyPrice: 10.0,
    currentPrice: 6.5,
    underlying: 'INFY',
    expiry: '2025-12-26',
    strike: 1200,
    optionSide: 'PUT',
  },
];

function formatCurrency(value) {
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Number(value).toFixed(2);
}

export default function Positions({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('markets'); // markets / options / combined
  const [loading, setLoading] = useState(false);
  const [marketPositions, setMarketPositions] = useState([]);
  const [optionPositions] = useState(MOCK_POSITIONS.filter(p => p.type === 'OPTION'));
  const [stocksData, setStocksData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  // Fetch and update stock data every 4 seconds
  const updateStocksData = async () => {
    try {
      const promises = STOCK_SYMBOLS.map(symbol =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching ${symbol}:`, err);
            return null;
          })
      );

      const results = await Promise.all(promises);
      const formatted = results
        .filter(item => item !== null)
        .map(item => ({
          symbol: item.symbol,
          price: parseFloat(item.lastPrice) || 0,
          change: parseFloat(item.priceChangePercent) || 0,
          high: parseFloat(item.highPrice) || 0,
          low: parseFloat(item.lowPrice) || 0,
          volume: parseFloat(item.volume) || 0,
          openPrice: parseFloat(item.openPrice) || 0
        }));

      setStocksData(formatted);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };


  const fetchMarketPositions = async () => {
    try {
      const res = await axiosInstance.get('/trading/positions');
      return res.data.data;   // backend returns { success, data }
    } catch (err) {
      console.log('Error fetching market positions', err);
      return [];
    }
  };


  const mergePricesWithPositions = (positions, liveData) => {
    return positions.map(p => {
      const live = liveData.find(i => i.symbol === p.symbol + "USDT");
      return {
        ...p,
        currentPrice: live ? live.price : p.currentPrice,
      };
    });
  };

  // Partition positions by type
  const markets = mergePricesWithPositions(marketPositions, stocksData);
  const options = optionPositions;
  const combined = [...markets, ...options];

  // Derived totals (unrealised P/L and portfolio value)
  const totals = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;

    const accumulate = (pos) => {
      const positionValue = pos.qty * pos.currentPrice;
      const positionCost = pos.qty * pos.avgBuyPrice;
      totalValue += positionValue;
      totalCost += positionCost;
    };

    [...markets, ...options].forEach(accumulate);
    const unrealisedPL = totalValue - totalCost;

    return {
      totalValue,
      totalCost,
      unrealisedPL,
    };
  }, [markets, options]);

  useEffect(() => {
    fetchPositions();                   // initial fetch
    updateStocksData();                 // initial price load

    const interval = setInterval(() => {
      updateStocksData();             // every 4s update prices
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchPositions = async () => {
    const data = await fetchMarketPositions();
    const normalize = (item) => ({
      id: item._id,
      symbol: item.symbol,
      type: "MARKET",
      qty: item.totalQuantity,
      avgBuyPrice: item.averagePrice,
      currentPrice: item.currentPrice || item.averagePrice,
      exchange: item.exchange || "",
    });
    setMarketPositions(data.map(normalize));
  };

  const renderPositionCard = (pos) => {
    const info = SYMBOL_INFO[pos.symbol.split(' ')[0]] || {};
    const value = pos.qty * pos.currentPrice;
    const cost = pos.qty * pos.avgBuyPrice;
    const pl = value - cost;
    const plPercent = cost === 0 ? 0 : (pl / cost) * 100;
    const isPositive = pl >= 0;

    return (
      <TouchableOpacity key={pos.id} style={styles.positionCard} activeOpacity={0.8}>
        <View style={styles.positionLeft}>
          {info.image ? (
            <Image source={{ uri: info.image }} style={styles.logo} resizeMode="contain" />
          ) : (
            <View style={styles.symbolPlaceholder}>
              <Text style={styles.symbolPlaceholderText}>{pos.symbol.charAt(0)}</Text>
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.symbolText}>
              {pos.symbol.split(' ')[0]} {pos.type === 'OPTION' ? `(opt)` : ''}
            </Text>
            <Text style={styles.nameText}>{info.name ?? pos.symbol}</Text>
            {pos.type === 'OPTION' && (
              <Text style={styles.smallMeta}>
                {pos.optionSide} • Strike {pos.strike} • Exp {pos.expiry}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.positionRight}>
          <Text style={styles.qtyText}>{pos.qty} {pos.type === 'OPTION' ? 'ct' : ''} </Text>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.smallLabel}>Avg</Text>
            <Text style={styles.monoText}>{formatCurrency(pos.avgBuyPrice)}</Text>
          </View>

          <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
            <Text style={styles.smallLabel}>Now</Text>
            <Text style={styles.monoText}>{formatCurrency(pos.currentPrice)}</Text>
          </View>

          <View style={{ alignItems: 'flex-end', marginLeft: 16 }}>
            <Text style={styles.smallLabel}>Value</Text>
            <Text style={[styles.monoText, { fontWeight: '700' }]}>
              {formatCurrency(value)}
            </Text>
          </View>

          <View style={[styles.plBadge, isPositive ? styles.plPos : styles.plNeg]}>
            <Feather name={isPositive ? 'trending-up' : 'trending-down'} size={12} color="#fff" />
            <Text style={styles.plText}>
              {isPositive ? '+' : ''}{formatCurrency(pl)} ({isPositive ? '+' : ''}{plPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Positions</Text>
        </View>

        {/* Portfolio summary */}
        <View style={styles.portfolioRow}>
          <View>
            <Text style={styles.portfolioLabel}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>$ {formatCurrency(totals.totalValue)}</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.portfolioLabel}>Unrealised P/L</Text>
            <Text style={[styles.portfolioPL, totals.unrealisedPL >= 0 ? styles.plPosText : styles.plNegText]}>
              {totals.unrealisedPL >= 0 ? '+' : ''}$ {formatCurrency(totals.unrealisedPL)}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'combined' && styles.tabActive]}
            onPress={() => setSelectedTab('combined')}
          >
            <Text style={[styles.tabText, selectedTab === 'combined' && styles.tabTextActive]}>Combined</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'markets' && styles.tabActive]}
            onPress={() => setSelectedTab('markets')}
          >
            <Text style={[styles.tabText, selectedTab === 'markets' && styles.tabTextActive]}>Markets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'options' && styles.tabActive]}
            onPress={() => setSelectedTab('options')}
          >
            <Text style={[styles.tabText, selectedTab === 'options' && styles.tabTextActive]}>Options</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Combined view shows Markets first then Options */}
          {selectedTab === 'combined' && (
            <>
              <Text style={styles.sectionTitle}>Markets</Text>
              {markets.length === 0 ? (
                <Text style={styles.emptyText}>No market positions</Text>
              ) : (
                markets.map(renderPositionCard)
              )}

              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Options</Text>
              {options.length === 0 ? (
                <Text style={styles.emptyText}>No options positions</Text>
              ) : (
                options.map(renderPositionCard)
              )}
            </>
          )}

          {selectedTab === 'markets' && (
            <>
              <Text style={styles.sectionTitle}>Market Positions</Text>
              {markets.length === 0 ? <Text style={styles.emptyText}>No market positions</Text> : markets.map(renderPositionCard)}
            </>
          )}

          {selectedTab === 'options' && (
            <>
              <Text style={styles.sectionTitle}>Options Positions</Text>
              {options.length === 0 ? <Text style={styles.emptyText}>No options positions</Text> : options.map(renderPositionCard)}
            </>
          )}

          {/* Footer totals card */}
          <View style={styles.footerCard}>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Cost</Text>
              <Text style={styles.footerValue}>$ {formatCurrency(totals.totalCost)}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Portfolio Value</Text>
              <Text style={styles.footerValue}>$ {formatCurrency(totals.totalValue)}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Unrealised P/L</Text>
              <Text style={[styles.footerValue, totals.unrealisedPL >= 0 ? styles.plPosText : styles.plNegText]}>
                {totals.unrealisedPL >= 0 ? '+' : ''}$ {formatCurrency(totals.unrealisedPL)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
    headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
    headerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  portfolioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  portfolioLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  portfolioValue: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 6 },
  portfolioPL: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 6 },

  tabsContainer: { flexDirection: 'row', marginTop: 16, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  tabText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  emptyText: { color: '#6B7280', paddingVertical: 12 },

  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  positionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logo: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#fff' },
  symbolPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolPlaceholderText: { fontSize: 18, fontWeight: '700', color: '#2E5CFF' },
  symbolText: { fontSize: 15, fontWeight: '700', color: '#111827' },
  nameText: { fontSize: 12, color: '#6B7280' },
  smallMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },

  positionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  qtyText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  smallLabel: { fontSize: 11, color: '#9CA3AF' },
  monoText: { fontSize: 13, color: '#111827', fontFamily: undefined },

  plBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plPos: { backgroundColor: '#10B981' },
  plNeg: { backgroundColor: '#EF4444' },
  plText: { color: '#fff', fontSize: 12, marginLeft: 6 },

  footerCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginVertical: 18,
    borderWidth: 1,
    borderColor: '#E6E9F0',
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  footerLabel: { color: '#6B7280', fontSize: 13 },
  footerValue: { fontSize: 14, fontWeight: '700', color: '#111827' },

  plPosText: { color: '#10B981', fontWeight: '700' },
  plNegText: { color: '#EF4444', fontWeight: '700' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
