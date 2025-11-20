// screens/StocksScreen.js
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useRef, useState } from 'react';
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

  const scrollRef = useRef(null);
  const [autoScrollIndex, setAutoScrollIndex] = useState(0);


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

  useEffect(() => {
    if (duplicatedTrending.length === 0) return;

    const interval = setInterval(() => {
      setAutoScrollIndex((prev) => {
        const newIndex = prev + 1;

        // Smooth scroll
        scrollRef.current?.scrollToOffset({
          offset: newIndex * CARD_WIDTH * 1.2,
          animated: true,
        });

        // If at end → jump back smoothly
        if (newIndex >= duplicatedTrending.length - 1) {
          setTimeout(() => {
            scrollRef.current?.scrollToOffset({
              offset: 0,
              animated: false,
            });
          }, 300);
          return 0;
        }
        return newIndex;
      });
    }, 1800); // Auto scroll speed

    return () => clearInterval(interval);
  }, [duplicatedTrending]);

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

  // Split marketData into three parts
  const first10Stocks = marketData.slice(0, 10);
  const next10Stocks = marketData.slice(10, 20);
  const last10Stocks = marketData.slice(20, 32);

  const duplicatedTrending = [...next10Stocks, ...next10Stocks];


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

        {/* First 10 Stocks - Grid Cards (2 per row) */}
        {first10Stocks.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionSubtitle}>Top Performers</Text>
            </View>
            <View style={styles.stocksGrid}>
              {first10Stocks.map((stock) => {
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
              })}
            </View>
          </>
        )}

        {/* Next 10 Stocks - Horizontal Cards */}
        {next10Stocks.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionSubtitle}>Trending Assets</Text>
            </View>
            {/* <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {next10Stocks.map((stock) => {
                const info = SYMBOL_INFO[stock.symbol] || {
                  name: stock.symbol.replace('USDT', ''),
                  image: paperBullLogo
                };
                return (
                  <HorizontalStockCard
                    key={stock.symbol}
                    stock={stock}
                    info={info}
                    onPress={() => handleStockPress(stock)}
                  />
                );
              })}
            </ScrollView> */}
            <FlatList
              ref={scrollRef}
              data={duplicatedTrending}
              keyExtractor={(item, index) => item.symbol + index}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const info = SYMBOL_INFO[item.symbol] || {
                  name: item.symbol.replace('USDT', ''),
                  image: paperBullLogo,
                };
                return (
                  <HorizontalStockCard
                    stock={item}
                    info={info}
                    onPress={() => handleStockPress(item)}
                  />
                );
              }}
              getItemLayout={(data, index) => ({
                length: CARD_WIDTH * 1.2,
                offset: (CARD_WIDTH * 1.2) * index,
                index,
              })}
            />
          </>
        )}

        {/* Last 10 Stocks - Icons with Names */}
        {last10Stocks.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionSubtitle}>Other Assets</Text>
            </View>
            <View style={styles.iconsGrid}>
              {last10Stocks.map((stock) => {
                const info = SYMBOL_INFO[stock.symbol] || {
                  name: stock.symbol.replace('USDT', ''),
                  image: paperBullLogo
                };
                return (
                  <StockIcon
                    key={stock.symbol}
                    stock={stock}
                    info={info}
                    onPress={() => handleStockPress(stock)}
                  />
                );
              })}
            </View>
          </>
        )}

        {marketData.length === 0 && (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>No assets found</Text>
            <Text style={styles.emptySubtext}>Pull to refresh</Text>
          </View>
        )}

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

// Original Stock Card Component (for first 10)
function StockCard({ stock, info, onPress }) {
  const isPositive = stock.change >= 0;
  const changeValue = !isNaN(stock.change) ? stock.change : 0;
  const priceValue = !isNaN(stock.price) ? stock.price : 0;

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

// Horizontal Stock Card Component (for next 10)
function HorizontalStockCard({ stock, info, onPress }) {
  const isPositive = stock.change >= 0;
  const changeValue = !isNaN(stock.change) ? stock.change : 0;
  const priceValue = !isNaN(stock.price) ? stock.price : 0;

  return (
    <TouchableOpacity
      style={styles.horizontalCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.horizontalCardContent}>
        <View style={styles.horizontalImageContainer}>
          <Image
            source={typeof info.image === "string" ? { uri: info.image } : info.image}
            style={styles.horizontalImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.horizontalInfo}>
          <Text style={styles.horizontalSymbol}>
            {stock.symbol.replace('USDT', '')}
          </Text>
          <Text style={styles.horizontalName} numberOfLines={1}>
            {info.name}
          </Text>
        </View>

        <View style={styles.horizontalPriceContainer}>
          <Text style={styles.horizontalPrice}>
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
      </View>
    </TouchableOpacity>
  );
}

// Stock Icon Component (for last 10)
function StockIcon({ stock, info, onPress }) {
  const isPositive = stock.change >= 0;

  return (
    <TouchableOpacity
      style={styles.iconCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconImageContainer}>
        <Image
          source={typeof info.image === "string" ? { uri: info.image } : info.image}
          style={styles.iconImage}
          resizeMode="contain"
        />
        <View style={[
          styles.iconStatusDot,
          isPositive ? styles.statusPositive : styles.statusNegative
        ]} />
      </View>

      <Text style={styles.iconSymbol} numberOfLines={1}>
        {stock.symbol.replace('USDT', '')}
      </Text>
      <Text style={styles.iconName} numberOfLines={1}>
        {info.name}
      </Text>
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

  // Original Grid Styles
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

  // Horizontal Card Styles
  horizontalScroll: {
    marginBottom: 16,
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  horizontalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
    width: 220,
  },
  horizontalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  horizontalImage: {
    width: 28,
    height: 28,
  },
  horizontalInfo: {
    flex: 1,
    marginRight: 12,
  },
  horizontalSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  horizontalName: {
    fontSize: 12,
    color: '#6B7280',
  },
  horizontalPriceContainer: {
    alignItems: 'flex-end',
  },
  horizontalPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },

  // Icon Grid Styles
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: 'flex-start',
  },
  iconCard: {
    width: (width - 80) / 4, // 4 per row with padding
    alignItems: 'center',
    marginBottom: 16,
  },
  iconImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  iconImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusPositive: {
    backgroundColor: '#10B981',
  },
  statusNegative: {
    backgroundColor: '#EF4444',
  },
  iconSymbol: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 2,
  },
  iconName: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Common Styles
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