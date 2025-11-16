import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function MarketWatchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('watchlist');

  // Mock data for watchlist
  const watchlist = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 2.45, changePercent: 2.1 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3567.20, change: -15.80, changePercent: -0.44 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: 23.50, changePercent: 1.42 },
    { symbol: 'INFY', name: 'Infosys', price: 1456.30, change: 8.75, changePercent: 0.60 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 987.65, change: -5.20, changePercent: -0.52 },
  ];

  // Mock data for indices
  const indices = [
    { name: 'NIFTY 50', value: 19845.32, change: 145.67, changePercent: 0.74 },
    { name: 'SENSEX', value: 66589.93, change: 389.45, changePercent: 0.59 },
    { name: 'NIFTY BANK', value: 44523.15, change: -123.45, changePercent: -0.28 },
    { name: 'NIFTY IT', value: 32456.78, change: 234.56, changePercent: 0.73 },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
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
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stocks, indices..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#9CA3AF" />
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
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Your Watchlist</Text>
              <Text style={styles.listHeaderCount}>{watchlist.length} stocks</Text>
            </View>
            {watchlist.map((stock, index) => (
              <StockCard key={index} stock={stock} />
            ))}

            <TouchableOpacity style={styles.addMoreButton}>
              <Feather name="plus-circle" size={20} color="#2E5CFF" />
              <Text style={styles.addMoreText}>Add more stocks to watchlist</Text>
            </TouchableOpacity>
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

function StockCard({ stock }) {
  const isPositive = stock.change >= 0;

  return (
    <TouchableOpacity style={styles.stockCard} activeOpacity={0.7}>
      <View style={styles.stockLeft}>
        <View style={styles.stockIcon}>
          <Text style={styles.stockIconText}>{stock.symbol.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName}>{stock.name}</Text>
        </View>
      </View>

      <View style={styles.stockRight}>
        <Text style={styles.stockPrice}>₹{stock.price.toFixed(2)}</Text>
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