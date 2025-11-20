// screens/StocksScreen.js
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import paperBullLogo from "../../assets/defaultImage.png";
import { SYMBOL_INFO } from '../../constants/symbols';
import { CryptoContext } from '../../context/CryptoContext';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export default function StocksScreen() {
  const navigation = useNavigation();
  const {
    marketData,
    loading,
    refreshing,
    searchCrypto,
    refresh,
  } = useContext(CryptoContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search for cryptocurrencies using context
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      handleSearch(debouncedSearch);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [debouncedSearch]);

  const handleSearch = async (query) => {
    setSearchLoading(true);
    setShowSearchDropdown(true);
    try {
      const results = await searchCrypto(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStockPress = (stock) => {
    navigation.navigate('CryptoDetails', { stock });
  };

  const handleSearchResultPress = (result) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigation.navigate('CryptoDetails', {
      stock: {
        symbol: result.symbol,
        price: result.price,
        change: result.change,
        high: result.high || result.price,
        low: result.low || result.price,
        volume: result.volume || 0,
        openPrice: result.price
      }
    });
  };

  const onRefresh = () => {
    refresh();
  };

  const navigateToMarketWatch = () => {
    navigation.navigate('Account', { screen: 'MarketWatch' });
  };

  const navigateToLearningHub = () => {
    navigation.navigate('Account', { screen: 'LearningHub' });
  };

  // Show loading view initially
  if (loading && marketData.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2E5CFF', '#1A3FCC']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Crypto Markets</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E5CFF" />
          <Text style={styles.loadingText}>Loading markets...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Crypto Markets</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cryptocurrencies..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Banner */}
        {/* <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Feather name="trending-up" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Trading</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="currency-bitcoin" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{marketData.length}</Text>
            <Text style={styles.statLabel}>Assets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.liveDot} />
            <Text style={styles.statValue}>Live</Text>
            <Text style={styles.statLabel}>Updates</Text>
          </View>
        </View> */}
      </LinearGradient>

      {/* Search Dropdown */}
      {showSearchDropdown && searchQuery.length > 0 && (
        <View style={styles.searchDropdown}>
          {searchLoading ? (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator size="small" color="#2E5CFF" />
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.symbol}
              style={styles.searchResultsList}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => handleSearchResultPress(item)}
                >
                  <View style={styles.searchResultLeft}>
                    <Feather name="trending-up" size={18} color="#6B7280" />
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultSymbol}>{item.baseAsset}</Text>
                      <Text style={styles.searchResultName}>{item.symbol}</Text>
                    </View>
                  </View>
                  <View style={styles.searchResultRight}>
                    <Text style={styles.searchResultPrice}>
                      ${item.price >= 1 ? item.price.toFixed(2) : item.price.toFixed(6)}
                    </Text>
                    <Text style={[
                      styles.searchResultChange,
                      item.change >= 0 ? styles.changeTextPositive : styles.changeTextNegative
                    ]}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.searchEmptyContainer}>
              <Text style={styles.searchEmptyText}>No results found</Text>
            </View>
          )}
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2E5CFF"
          />
        }
      >
        {/* Market Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Overview</Text>
          <Text style={styles.sectionSubtitle}>
            Tap any asset to view detailed information
          </Text>
        </View>

        {/* Stocks Grid - 2 per row */}
        <View style={styles.stocksGrid}>
          {marketData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="search" size={48} color="#E5E7EB" />
              <Text style={styles.emptyText}>No assets found</Text>
              <Text style={styles.emptySubtext}>Pull to refresh</Text>
            </View>
          ) : (
            marketData.map((stock) => {
              // console.log(stock)
              const info = SYMBOL_INFO[stock.symbol] || {
                name: stock.symbol.replace('USDT', ''),
                image: paperBullLogo
              };
              return (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  info={info}
                  onPress={() => handleStockPress(stock)}
                />
              );
            })
          )}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={navigateToMarketWatch}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.quickActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="eye" size={24} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Market Watch</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={navigateToLearningHub}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.quickActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="book-open" size={24} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Learning Hub</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Stock Card Component
function StockCard({ stock, info, onPress }) {
  const isPositive = stock.change >= 0;
  const changeValue = !isNaN(stock.change) ? stock.change : 0;
  const priceValue = !isNaN(stock.price) ? stock.price : 0;
  // console.log(info)
  return (
    <TouchableOpacity
      style={styles.stockCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.stockImageContainer}>
        <Image
          source={typeof info.image === "string" ? { uri: info.image } : info.image}
          style={styles.stockImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>
          {stock.symbol.replace('USDT', '')}
        </Text>
        <Text style={styles.stockName} numberOfLines={1}>
          {info.name}
        </Text>
      </View>

      <View style={styles.stockPriceContainer}>
        <Text style={styles.stockPrice}>
          ${priceValue >= 1 ? priceValue.toFixed(2) : priceValue.toFixed(4)}
        </Text>
        <View style={[
          styles.changeChip,
          isPositive ? styles.changePositive : styles.changeNegative
        ]}>
          <Feather
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={10}
            color={isPositive ? '#10B981' : '#EF4444'}
          />
          <Text style={[
            styles.changeText,
            isPositive ? styles.changeTextPositive : styles.changeTextNegative
          ]}>
            {Math.abs(changeValue).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    position: 'relative',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexShrink: 1
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lastUpdated: {
    position: 'absolute',
    right: 0,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  searchWrapper: {
    marginTop: 16,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
  },
  searchDropdown: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    zIndex: 9999,
  },
  searchLoadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchResultsList: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  searchResultName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  searchResultRight: {
    alignItems: 'flex-end',
  },
  searchResultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  searchResultChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  searchEmptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  searchEmptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
    gap: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  stocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  stockCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  stockImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 8,
  },
  stockImage: {
    width: 40,
    height: 40,
  },
  stockInfo: {
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  stockName: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  stockPriceContainer: {
    alignItems: 'center',
    width: '100%',
  },
  stockPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  changeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  changePositive: {
    backgroundColor: '#DCFCE7',
  },
  changeNegative: {
    backgroundColor: '#FEE2E2',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: '#10B981',
  },
  changeTextNegative: {
    color: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: CARD_WIDTH,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
});