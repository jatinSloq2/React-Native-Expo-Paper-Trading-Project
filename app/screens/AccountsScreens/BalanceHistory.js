import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import axiosInstance from "../../api/axiosInstance";

export default function BalanceHistoryScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [summary, setSummary] = useState({ totalCredit: 0, totalDebit: 0 });

  const fetchTransactions = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await AsyncStorage.getItem("token");
      const apiKey = await AsyncStorage.getItem("api_key");

      const res = await axiosInstance.get(`/balance/history?page=${pageNum}&limit=20`, {
      headers: {
          Authorization: `Bearer ${token}`,
          "X-API-Key": apiKey || "",
        },
      });

      if (isRefresh) {
        setTransactions(res.data.transactions);
        setPage(1);
      } else {
        setTransactions(prev => 
          pageNum === 1 ? res.data.transactions : [...prev, ...res.data.transactions]
        );
      }

      // Update summary only on first page or refresh
      if (pageNum === 1 || isRefresh) {
        setSummary(res.data.summary || { totalCredit: 0, totalDebit: 0 });
      }

      setHasMore(res.data.transactions.length === 20);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    fetchTransactions(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage);
    }
  };

  const renderTransaction = ({ item }) => {
    const isCredit = item.type === "CREDIT";
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString("en-IN", {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIconContainer,
            { backgroundColor: isCredit ? '#DCFCE7' : '#FEE2E2' }
          ]}>
            <Feather 
              name={isCredit ? 'arrow-down-left' : 'arrow-up-right'} 
              size={24} 
              color={isCredit ? '#10B981' : '#EF4444'} 
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionReason}>
              {item.reason?.replace(/_/g, ' ') || 'Transaction'}
            </Text>
            <Text style={styles.transactionDate}>
              {formattedDate} • {formattedTime}
            </Text>
          </View>
        </View>
        
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { color: isCredit ? '#10B981' : '#EF4444' }
          ]}>
            {isCredit ? '+' : '-'}₹{item.amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          <Text style={styles.transactionBalance}>
            Bal: ₹{item.balanceAfter.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    if (transactions.length === 0) return null;
    
    const netBalance = summary.totalCredit - summary.totalDebit;
    
    return (
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Overall Summary</Text>
        
        <View style={styles.summaryCards}>
          {/* Total Credit Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="trending-up" size={20} color="#10B981" />
              </View>
              <Text style={styles.summaryLabel}>Total Credit</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: '#10B981' }]}>
              ₹{summary.totalCredit.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
          </View>

          {/* Total Debit Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardHeader}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="trending-down" size={20} color="#EF4444" />
              </View>
              <Text style={styles.summaryLabel}>Total Debit</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>
              ₹{summary.totalDebit.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
          </View>
        </View>

        {/* Net Balance Card */}
        <View style={[
          styles.netBalanceCard,
          { backgroundColor: netBalance >= 0 ? '#EFF6FF' : '#FEF2F2' }
        ]}>
          <View style={styles.netBalanceHeader}>
            <Feather 
              name="activity" 
              size={20} 
              color={netBalance >= 0 ? '#2E5CFF' : '#EF4444'} 
            />
            <Text style={styles.netBalanceLabel}>Net Balance</Text>
          </View>
          <Text style={[
            styles.netBalanceAmount,
            { color: netBalance >= 0 ? '#2E5CFF' : '#EF4444' }
          ]}>
            {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
        </View>

        <View style={styles.sectionDivider}>
          <Text style={styles.sectionDividerText}>Recent Transactions</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2E5CFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Feather name="file-text" size={64} color="#9CA3AF" />
        </View>
        <Text style={styles.emptyTitle}>No Transactions Yet</Text>
        <Text style={styles.emptyText}>
          Your transaction history will appear here
        </Text>
      </View>
    );
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E5CFF" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2E5CFF', '#1A3FCC']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2E5CFF"
            colors={["#2E5CFF"]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
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
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#6B7280',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  netBalanceCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  netBalanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  netBalanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  netBalanceAmount: {
    fontSize: 28,
    fontWeight: '700',
  },
  sectionDivider: {
    marginBottom: 16,
  },
  sectionDividerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionReason: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionBalance: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
});