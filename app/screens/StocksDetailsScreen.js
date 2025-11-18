import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Symbol info with images
const EXTENDED_SYMBOL_INFO = {
  BTCUSDT: { name: 'Bitcoin', color: '#F7931A', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  ETHUSDT: { name: 'Ethereum', color: '#627EEA', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  BNBUSDT: { name: 'Binance', color: '#F3BA2F', image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  SOLUSDT: { name: 'Solana', color: '#14F195', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  XRPUSDT: { name: 'Ripple', color: '#23292F', image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  ADAUSDT: { name: 'Cardano', color: '#0033AD', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  DOGEUSDT: { name: 'Dogecoin', color: '#C2A633', image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
  MATICUSDT: { name: 'Polygon', color: '#8247E5', image: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  DOTUSDT: { name: 'Polkadot', color: '#E6007A', image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
  LTCUSDT: { name: 'Litecoin', color: '#345D9D', image: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' },
};

export default function CryptoDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { stock: initialStock } = route.params;

  const [stock, setStock] = useState(initialStock);
  const [loading, setLoading] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
  const updateIntervalRef = useRef(null);

  const symbolInfo = EXTENDED_SYMBOL_INFO[stock.symbol] || {
    name: stock.symbol.replace('USDT', ''),
    color: '#2E5CFF',
    image: null
  };

  const isPositive = stock.change >= 0;
  const changeValue = !isNaN(stock.change) ? stock.change : 0;
  const priceValue = !isNaN(stock.price) ? stock.price : 0;

  // Update stock data every 4 seconds
  const updateStockData = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${stock.symbol}`);
      const data = await response.json();
      
      setStock({
        symbol: data.symbol,
        price: parseFloat(data.lastPrice) || 0,
        change: parseFloat(data.priceChangePercent) || 0,
        high: parseFloat(data.highPrice) || 0,
        low: parseFloat(data.lowPrice) || 0,
        volume: parseFloat(data.volume) || 0,
        openPrice: parseFloat(data.openPrice) || 0,
        quoteVolume: parseFloat(data.quoteVolume) || 0,
        trades: data.count || 0,
      });
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  useEffect(() => {
    updateStockData();

    updateIntervalRef.current = setInterval(() => {
      updateStockData();
    }, 4000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [stock.symbol]);

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
  };

  const timeframes = ['1H', '24H', '7D', '1M', '1Y'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            {symbolInfo.image && (
              <Image
                source={{ uri: symbolInfo.image }}
                style={styles.headerImage}
                resizeMode="contain"
              />
            )}
            <View>
              <Text style={styles.headerTitle}>
                {stock.symbol.replace('USDT', '')}
              </Text>
              <Text style={styles.headerSubtitle}>{symbolInfo.name}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.watchlistButton}
            onPress={toggleWatchlist}
          >
            <Feather 
              name={isWatchlisted ? "star" : "star"} 
              size={20} 
              color={isWatchlisted ? "#F59E0B" : "#FFFFFF"}
              fill={isWatchlisted ? "#F59E0B" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>
            ${priceValue >= 1 ? priceValue.toFixed(2) : priceValue.toFixed(6)}
          </Text>
          <View style={styles.changeContainer}>
            <Feather
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={isPositive ? '#10B981' : '#EF4444'}
            />
            <Text style={[
              styles.changeText,
              isPositive ? styles.changePositive : styles.changeNegative
            ]}>
              {isPositive ? '+' : ''}{changeValue.toFixed(2)}%
            </Text>
            <Text style={styles.changeLabel}>Today</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          {timeframes.map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeButton,
                selectedTimeframe === tf && styles.timeframeButtonActive
              ]}
              onPress={() => setSelectedTimeframe(tf)}
            >
              <Text style={[
                styles.timeframeText,
                selectedTimeframe === tf && styles.timeframeTextActive
              ]}>
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartContainer}>
          <LinearGradient
            colors={['#F3F4F6', '#E5E7EB']}
            style={styles.chartPlaceholder}
          >
            <Feather name="trending-up" size={48} color="#9CA3AF" />
            <Text style={styles.chartPlaceholderText}>Chart Coming Soon</Text>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Market Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Feather name="arrow-up" size={20} color="#10B981" />
              </View>
              <Text style={styles.statLabel}>24h High</Text>
              <Text style={styles.statValue}>
                ${stock.high >= 1 ? stock.high.toFixed(2) : stock.high.toFixed(6)}
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="arrow-down" size={20} color="#EF4444" />
              </View>
              <Text style={styles.statLabel}>24h Low</Text>
              <Text style={styles.statValue}>
                ${stock.low >= 1 ? stock.low.toFixed(2) : stock.low.toFixed(6)}
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Feather name="activity" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>
                {(stock.volume / 1000000).toFixed(2)}M
              </Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Feather name="dollar-sign" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statLabel}>Quote Volume</Text>
              <Text style={styles.statValue}>
                ${(stock.quoteVolume ? stock.quoteVolume / 1000000 : 0).toFixed(2)}M
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Open Price</Text>
              <Text style={styles.infoValue}>
                ${stock.openPrice >= 1 ? stock.openPrice.toFixed(2) : stock.openPrice.toFixed(6)}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Number of Trades</Text>
              <Text style={styles.infoValue}>
                {stock.trades ? stock.trades.toLocaleString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Market</Text>
              <Text style={styles.infoValue}>Binance</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About {symbolInfo.name}</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              {symbolInfo.name} is a cryptocurrency trading on Binance. 
              Real-time price updates are fetched every 4 seconds to ensure 
              you have the latest market information.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.buyButton}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="trending-up" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Buy</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sellButton}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Feather name="trending-down" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Sell</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  headerImage: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  watchlistButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  changePositive: {
    color: '#10B981',
  },
  changeNegative: {
    color: '#EF4444',
  },
  changeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: '#2E5CFF',
    borderColor: '#2E5CFF',
  },
  timeframeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  aboutSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  buyButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sellButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});