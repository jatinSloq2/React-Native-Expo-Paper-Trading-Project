// Positions.js
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import TradingModal from '../components/TradingModel';
import OrderSuccessModal from '../components/OrderSuccessModal';
import { SYMBOL_INFO } from '../../constants/symbols';

const STOCK_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
  'ADAUSDT', 'DOGEUSDT', 'MATICUSDT', 'DOTUSDT', 'LTCUSDT'
];

function formatCurrency(value) {
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Number(value).toFixed(2);
}

export default function Positions({ navigation }) {
  const { user, token, apiKey, fetchUser } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState('markets');
  const [loading, setLoading] = useState(true);
  const [marketPositions, setMarketPositions] = useState([]);
  const [optionPositions] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Trading Modal States
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderData, setSuccessOrderData] = useState(null);
  const [lastOrderType, setLastOrderType] = useState('SELL');

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
      const res = await axiosInstance.get('/trading/positions', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': apiKey || '',
        },
      });
      return res.data.data;
    } catch (err) {
      console.log('Error fetching market positions', err);
      return [];
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await axiosInstance.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': apiKey || '',
        },
      });
      setUserBalance(response.data.user.virtualBalance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const mergePricesWithPositions = (positions, liveData) => {
    return positions.map(p => {
      const live = liveData.find(i => i.symbol === p.symbol + "USDT");
      return {
        ...p,
        currentPrice: live ? live.price : p.currentPrice,
        change: live ? live.change : 0,
        high: live ? live.high : 0,
        low: live ? live.low : 0,
      };
    });
  };

  const markets = mergePricesWithPositions(marketPositions, stocksData);
  const options = optionPositions;

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
    if (user && token) {
      fetchPositions();
      fetchUserBalance();
      updateStocksData();

      const interval = setInterval(() => {
        updateStocksData();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [user, token]);

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchPositions();
    fetchUserBalance();
    updateStocksData();
  };

  const handlePositionClick = (pos) => {
    if (!user || !token) {
      Alert.alert('Not Logged In', 'Please login to trade');
      return;
    }

    // Find the live stock data for this position
    const liveStock = stocksData.find(s => s.symbol === pos.symbol + 'USDT');

    // Create stock object with live data
    const stockData = {
      symbol: pos.symbol + 'USDT',
      price: liveStock ? liveStock.price : pos.currentPrice,
      change: liveStock ? liveStock.change : 0,
      high: liveStock ? liveStock.high : pos.currentPrice,
      low: liveStock ? liveStock.low : pos.currentPrice,
      volume: liveStock ? liveStock.volume : 0,
      openPrice: liveStock ? liveStock.openPrice : pos.currentPrice,
    };

    setSelectedStock(stockData);
    setShowTradingModal(true);
  };

  const handleOrderSuccess = () => {
    fetchPositions();
    fetchUserBalance();
  };

  const renderPositionCard = (pos) => {
    const info = SYMBOL_INFO[pos.symbol] || SYMBOL_INFO[pos.symbol + 'USDT'] || {};
    const value = pos.qty * pos.currentPrice;
    const cost = pos.qty * pos.avgBuyPrice;
    const pl = value - cost;
    const plPercent = cost === 0 ? 0 : (pl / cost) * 100;
    const isPositive = pl >= 0;

    return (
      <TouchableOpacity
        key={pos.id}
        style={styles.positionCard}
        activeOpacity={0.7}
        onPress={() => handlePositionClick(pos)}
      >
        <View style={styles.cardTop}>
          <View style={styles.stockLeft}>
            {info.image ? (
              <View style={styles.stockImageContainer}>
                <Image source={{ uri: info.image }} style={styles.stockImage} resizeMode="contain" />
              </View>
            ) : (
              <View style={styles.symbolPlaceholder}>
                <Text style={styles.symbolPlaceholderText}>{pos.symbol.charAt(0)}</Text>
              </View>
            )}
            <View>
              <Text style={styles.symbolText}>{pos.symbol}</Text>
              <Text style={styles.nameText}>{info.name || pos.symbol}</Text>
            </View>
          </View>

          <View style={styles.stockRight}>
            <Text style={styles.valueText}>$ {formatCurrency(value)}</Text>
            <View style={[styles.changeBadge, isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative]}>
              <Feather name={isPositive ? 'trending-up' : 'trending-down'} size={12} color={isPositive ? '#10B981' : '#DC2626'} />
              <Text style={[styles.changeText, isPositive ? styles.changeTextPositive : styles.changeTextNegative]}>
                {isPositive ? '+' : ''}$ {formatCurrency(Math.abs(pl))} ({isPositive ? '+' : ''}{plPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBottom}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Quantity</Text>
            <Text style={styles.infoValue}>{pos.qty}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Avg Price</Text>
            <Text style={styles.infoValue}>$ {formatCurrency(pos.avgBuyPrice)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Current Price</Text>
            <Text style={styles.infoValue}>$ {formatCurrency(pos.currentPrice)}</Text>
          </View>
        </View>

        <View style={styles.tapToSellHint}>
          <Feather name="info" size={12} color="#6B7280" />
          <Text style={styles.tapToSellText}>Tap to sell this position</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const displayPositions = selectedTab === 'combined' ? [...markets, ...options] :
    selectedTab === 'markets' ? markets : options;

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

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'combined' && styles.tabActive]}
            onPress={() => setSelectedTab('combined')}
          >
            <Text style={[styles.tabText, selectedTab === 'combined' && styles.tabTextActive]}>All</Text>
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
          <ActivityIndicator size="large" color="#2E5CFF" />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Portfolio Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Portfolio Value</Text>
                <Text style={styles.summaryValue}>$ {formatCurrency(totals.totalValue)}</Text>
              </View>
              <View style={[styles.summaryItem, { alignItems: 'flex-end' }]}>
                <Text style={styles.summaryLabel}>Unrealised P/L</Text>
                <Text style={[styles.summaryValue, totals.unrealisedPL >= 0 ? styles.plPosText : styles.plNegText]}>
                  {totals.unrealisedPL >= 0 ? '+' : ''}$ {formatCurrency(Math.abs(totals.unrealisedPL))}
                </Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Invested</Text>
                <Text style={styles.summarySubValue}>$ {formatCurrency(totals.totalCost)}</Text>
              </View>
              <View style={[styles.summaryItem, { alignItems: 'flex-end' }]}>
                <Text style={styles.summaryLabel}>Return %</Text>
                <Text style={[styles.summarySubValue, totals.unrealisedPL >= 0 ? styles.plPosText : styles.plNegText]}>
                  {totals.unrealisedPL >= 0 ? '+' : ''}{totals.totalCost > 0 ? ((totals.unrealisedPL / totals.totalCost) * 100).toFixed(2) : '0.00'}%
                </Text>
              </View>
            </View>
          </View>

          {/* Positions List */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {selectedTab === 'combined' ? 'All Positions' :
                selectedTab === 'markets' ? 'Market Positions' : 'Options Positions'}
            </Text>
            <Text style={styles.listHeaderCount}>{displayPositions.length} positions</Text>
          </View>

          {displayPositions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="briefcase" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No positions yet</Text>
              <Text style={styles.emptySubText}>Start trading to see your positions here</Text>
            </View>
          ) : (
            displayPositions.map(renderPositionCard)
          )}

          {/* Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <Feather name="alert-circle" size={14} color="#F59E0B" />
            <Text style={styles.disclaimerText}>
              Virtual trading with simulated prices for educational purposes only. All trades are fake and no real money is involved.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Trading Modal for Selling */}
      {selectedStock && (
        <TradingModal
          user={user}
          visible={showTradingModal}
          onClose={() => {
            setShowTradingModal(false);
            setSelectedStock(null);
          }}
          stock={selectedStock}
          orderType="SELL"
          userBalance={userBalance}
          onOrderSuccess={handleOrderSuccess}
          setSuccessOrderData={setSuccessOrderData}
          setShowSuccessModal={setShowSuccessModal}
          setLastOrderType={setLastOrderType}
          fetchUser={fetchUser}
        />
      )}

      {/* Order Success Modal */}
      <OrderSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={successOrderData || {
          symbol: 'BTC',
          quantity: '0',
          price: '0',
          total: '0',
        }}
        orderType={lastOrderType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  tabsContainer: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },

  content: { flex: 1, padding: 20 },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  summarySubValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  listHeaderCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  positionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stockImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 8,
  },
  stockImage: {
    width: 32,
    height: 32,
  },
  symbolPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symbolPlaceholderText: { fontSize: 18, fontWeight: '700', color: '#2E5CFF' },
  symbolText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  nameText: { fontSize: 12, color: '#6B7280' },

  stockRight: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  changeBadgePositive: {
    backgroundColor: '#D1FAE5',
  },
  changeBadgeNegative: {
    backgroundColor: '#FEE2E2',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: '#10B981',
  },
  changeTextNegative: {
    color: '#DC2626',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
  },

  tapToSellHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  tapToSellText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },

  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 50,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },

  plPosText: { color: '#10B981' },
  plNegText: { color: '#DC2626' },

  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});