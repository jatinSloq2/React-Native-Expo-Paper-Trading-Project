import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import { SYMBOL_INFO } from '../../../constants/symbols';


export default function MarketWatchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('watchlist');
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const updateIntervalRef = useRef(null);

  const fetchWatchlist = async () => {
    try {
      const response = await axiosInstance.get('/user/watchlist');
      if (response.data && response.data.data) {
        await updateWatchlistData(response.data.data);
      } else {
        setWatchlist([]);
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setWatchlist([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateWatchlistData = async (watchlistItems) => {
    try {
      const symbols = watchlistItems.map(item => item.symbol);

      const promises = symbols.map(symbol =>
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
        .map((item, index) => ({
          symbol: item.symbol,
          name: watchlistItems[index].name || item.symbol.replace('USDT', ''),
          price: parseFloat(item.lastPrice) || 0,
          change: parseFloat(item.priceChange) || 0,
          changePercent: parseFloat(item.priceChangePercent) || 0,
          high: parseFloat(item.highPrice) || 0,
          low: parseFloat(item.lowPrice) || 0,
          volume: parseFloat(item.volume) || 0,
          openPrice: parseFloat(item.openPrice) || 0
        }));

      setWatchlist(formatted);
      setFilteredWatchlist(formatted);
    } catch (error) {
      console.error('Error updating watchlist data:', error);
      setWatchlist([]);
      setFilteredWatchlist([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStockPress = (stock) => {
    navigation.navigate('CryptoDetails', { stock });
  };

  const handleAddStocks = () => {
    navigation.navigate('Home');
  };

  // Mock data for indices
  const indices = [
    { name: 'NIFTY 50', value: 19845.32, change: 145.67, changePercent: 0.74 },
    { name: 'SENSEX', value: 66589.93, change: 389.45, changePercent: 0.59 },
    { name: 'NIFTY BANK', value: 44523.15, change: -123.45, changePercent: -0.28 },
    { name: 'NIFTY IT', value: 32456.78, change: 234.56, changePercent: 0.73 },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchWatchlist();
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWatchlist(watchlist);
    } else {
      const filtered = watchlist.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWatchlist(filtered);
    }
  }, [searchQuery, watchlist]);

  useEffect(() => {
    if (watchlist.length > 0 && selectedTab === 'watchlist') {
      updateIntervalRef.current = setInterval(async () => {
        try {
          const response = await axiosInstance.get('/user/watchlist');
          if (response.data && response.data.data) {
            await updateWatchlistData(response.data.data);
          }
        } catch (error) {
          console.error('Auto-update error:', error);
        }
      }, 4000);
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [watchlist.length, selectedTab]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Market Watch</Text>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#fff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks, indices..."
            placeholderTextColor="#fff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'watchlist' && styles.tabActive]}
            onPress={() => setSelectedTab('watchlist')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'watchlist' && styles.tabTextActive
            ]}>
              Watchlist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'indices' && styles.tabActive]}
            onPress={() => setSelectedTab('indices')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'indices' && styles.tabTextActive
            ]}>
              Indices
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {selectedTab === 'watchlist' ? (
          <>
            <>
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>Your Watchlist</Text>
                <Text style={styles.listHeaderCount}>{watchlist.length} stocks</Text>
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2E5CFF" />
                </View>
              ) : watchlist.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Feather name="bar-chart-2" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No stocks in watchlist</Text>
                  <TouchableOpacity onPress={() => handleAddStocks()}>
                    <Text style={styles.emptySubText}>Add to Watchlist</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                watchlist.map((stock, index) => (
                  <StockCard
                    key={index}
                    stock={stock}
                    onPress={() => handleStockPress(stock)}
                  />
                ))
              )}

              <TouchableOpacity style={styles.addMoreButton}>
                <Feather name="plus-circle" size={20} color="#2E5CFF" />
                <TouchableOpacity onPress={() => handleAddStocks()}>
                  <Text style={styles.addMoreText}>Add more stocks to watchlist</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </>
          </>
        ) : (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Market Indices</Text>
              <Text style={styles.listHeaderCount}>{indices.length} indices</Text>
            </View>
            {indices.map((index, i) => (
              <IndexCard key={i} index={index} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StockCard({ stock, onPress }) {
  const isPositive = stock.changePercent >= 0;
  const info = SYMBOL_INFO[stock.symbol] || { image: null };

  return (
    <TouchableOpacity
      style={styles.stockCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.stockLeft}>
        {info.image ? (
          <View style={styles.stockImageContainer}>
            <Image
              source={{ uri: info.image }}
              style={styles.stockImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.stockIcon}>
            <Text style={styles.stockIconText}>{stock.symbol.charAt(0)}</Text>
          </View>
        )}
        <View>
          <Text style={styles.stockSymbol}>{stock.symbol.replace('USDT', '')}</Text>
          <Text style={styles.stockName}>{stock.name}</Text>
        </View>
      </View>

      <View style={styles.stockRight}>
        <Text style={styles.stockPrice}>
          ${stock.price >= 1 ? stock.price.toFixed(2) : stock.price.toFixed(4)}
        </Text>
        <View style={[styles.changeBadge, isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative]}>
          <Feather
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={12}
            color={isPositive ? '#10B981' : '#DC2626'}
          />
          <Text style={[styles.changeText, isPositive ? styles.changeTextPositive : styles.changeTextNegative]}>
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function IndexCard({ index }) {
  const isPositive = index.change >= 0;

  return (
    <View style={styles.indexCard}>
      <View>
        <Text style={styles.indexName}>{index.name}</Text>
        <Text style={styles.indexValue}>{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
      </View>

      <View style={styles.indexRight}>
        <Text style={[styles.indexChange, isPositive ? styles.changeTextPositive : styles.changeTextNegative]}>
          {isPositive ? '+' : ''}{index.change.toFixed(2)}
        </Text>
        <View style={[styles.changeBadge, isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative]}>
          <Feather
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={12}
            color={isPositive ? '#10B981' : '#DC2626'}
          />
          <Text style={[styles.changeText, isPositive ? styles.changeTextPositive : styles.changeTextNegative]}>
            {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
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
  stockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stockIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stockIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E5CFF',
  },
  stockSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  stockName: {
    fontSize: 12,
    color: '#6B7280',
  },
  stockRight: {
    alignItems: 'flex-end',
  },
  stockPrice: {
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
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 8,
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E5CFF',
  },
  indexCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  indexName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  indexValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E5CFF',
  },
  indexRight: {
    alignItems: 'flex-end',
  },
  indexChange: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
});