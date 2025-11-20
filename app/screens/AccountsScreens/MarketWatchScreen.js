// screens/MarketWatchScreen.js
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import paperBullLogo from "../../../assets/paperbullfinallogo.png";
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
import { CryptoContext } from '../../../context/CryptoContext';

export default function MarketWatchScreen() {
  const navigation = useNavigation();
  const { marketData, getCryptoData, refreshing: contextRefreshing, refresh: contextRefresh } = useContext(CryptoContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('watchlist');
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);

  // Fetch watchlist items from backend
  const fetchWatchlist = async () => {
    try {
      const response = await axiosInstance.get('/user/watchlist');
      if (response.data && response.data.data) {
        setWatchlistItems(response.data.data);
      } else {
        setWatchlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setWatchlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Update watchlist data with live prices from context
  useEffect(() => {
    if (watchlistItems.length === 0) {
      setWatchlistData([]);
      setFilteredWatchlist([]);
      return;
    }

    const updatedWatchlist = watchlistItems.map(item => {
      const liveData = getCryptoData(item.symbol);

      if (liveData) {
        return {
          ...item,
          price: liveData.price,
          change: liveData.change,
          changePercent: liveData.change,
          high: liveData.high,
          low: liveData.low,
          volume: liveData.volume,
          openPrice: liveData.openPrice,
        };
      }

      // Fallback if symbol not in context
      return {
        ...item,
        price: 0,
        change: 0,
        changePercent: 0,
        high: 0,
        low: 0,
        volume: 0,
        openPrice: 0,
      };
    });

    setWatchlistData(updatedWatchlist);

    // Apply search filter
    if (searchQuery.trim() === '') {
      setFilteredWatchlist(updatedWatchlist);
    } else {
      const filtered = updatedWatchlist.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (stock.name && stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredWatchlist(filtered);
    }
  }, [watchlistItems, marketData, searchQuery]);

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

  const onRefresh = async () => {
    setLocalRefreshing(true);
    await Promise.all([
      contextRefresh(), // Refresh market data
      fetchWatchlist() // Refresh watchlist items
    ]);
    setLocalRefreshing(false);
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const refreshing = localRefreshing || contextRefreshing;

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleAddStocks}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#fff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks, indices..."
            placeholderTextColor="rgba(255,255,255,0.7)"
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2E5CFF"
          />
        }
      >
        {selectedTab === 'watchlist' ? (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Your Watchlist</Text>
              <Text style={styles.listHeaderCount}>{watchlistData.length} stocks</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2E5CFF" />
                <Text style={styles.loadingText}>Loading watchlist...</Text>
              </View>
            ) : watchlistData.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="bar-chart-2" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>No stocks in watchlist</Text>
                <TouchableOpacity
                  onPress={handleAddStocks}
                  style={styles.emptyButton}
                >
                  <Text style={styles.emptyButtonText}>Add Stocks to Watchlist</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {filteredWatchlist.map((stock, index) => (
                  <StockCard
                    key={index}
                    stock={stock}
                    onPress={() => handleStockPress(stock)}
                  />
                ))}

                {filteredWatchlist.length === 0 && searchQuery.trim() !== '' && (
                  <View style={styles.emptyContainer}>
                    <Feather name="search" size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubText}>Try a different search term</Text>
                  </View>
                )}

                {filteredWatchlist.length > 0 && (
                  <TouchableOpacity
                    style={styles.addMoreButton}
                    onPress={handleAddStocks}
                  >
                    <Feather name="plus-circle" size={20} color="#2E5CFF" />
                    <Text style={styles.addMoreText}>Add more stocks to watchlist</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
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
  const info = SYMBOL_INFO[stock.symbol] || {
    name: stock.symbol.replace('USDT', ''),
    color: '#2E5CFF',
    image: paperBullLogo
  };

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
              source={typeof info.image === "string" ?
                { uri: info.image } : info.image}
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
          <Text style={styles.stockName}>
            {stock.name || stock.symbol.replace('USDT', '')}
          </Text>
        </View>
      </View>

      <View style={styles.stockRight}>
        <Text style={styles.stockPrice}>
          ${stock.price >= 1 ? stock.price.toFixed(2) : stock.price.toFixed(4)}
        </Text>
        <View style={[
          styles.changeBadge,
          isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative
        ]}>
          <Feather
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={12}
            color={isPositive ? '#10B981' : '#DC2626'}
          />
          <Text style={[
            styles.changeText,
            isPositive ? styles.changeTextPositive : styles.changeTextNegative
          ]}>
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
        <Text style={styles.indexValue}>
          {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.indexRight}>
        <Text style={[
          styles.indexChange,
          isPositive ? styles.changeTextPositive : styles.changeTextNegative
        ]}>
          {isPositive ? '+' : ''}{index.change.toFixed(2)}
        </Text>
        <View style={[
          styles.changeBadge,
          isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative
        ]}>
          <Feather
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={12}
            color={isPositive ? '#10B981' : '#DC2626'}
          />
          <Text style={[
            styles.changeText,
            isPositive ? styles.changeTextPositive : styles.changeTextNegative
          ]}>
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
    paddingVertical: 60,
    gap: 12,
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
  emptyButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2E5CFF',
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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