import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import axiosInstance from "../../../api/axiosInstance";

export default function SeeYourTickets() {
    const navigation = useNavigation();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMyTickets = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("Token missing");
            return;
        }

        try {
            const res = await axiosInstance.get("/support/my-tickets", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTickets(res.data?.tickets || []);
        } catch (err) {
            console.log("Fetch tickets error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch on first load
    useEffect(() => {
        fetchMyTickets();
    }, []);

    // Fetch again when returning to screen
    useFocusEffect(
        useCallback(() => {
            fetchMyTickets();
        }, [])
    );

    // Pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchMyTickets();
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#2E5CFF", "#1A3FCC"]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Your Support Tickets</Text>
                <View style={{ width: 40 }} />
            </LinearGradient>

            {loading ? (
                <View style={styles.loaderBox}>
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
                    {tickets.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Feather name="inbox" size={40} color="#9CA3AF" />
                            <Text style={styles.emptyText}>No tickets found</Text>
                        </View>
                    ) : (
                        tickets.map((t) => (
                            <View key={t._id} style={styles.ticketCard}>
                                <View style={styles.ticketHeader}>
                                    <Text style={styles.ticketSubject}>{t.subject}</Text>
                                    <View style={[styles.statusBadge, getStatusColor(t.status)]}>
                                        <Text style={styles.statusText}>{t.status}</Text>
                                    </View>
                                </View>

                                <Text style={styles.ticketIssue}>Issue: {t.issueType}</Text>
                                <Text style={styles.ticketMessage}>{t.message}</Text>

                                <Text style={styles.ticketDate}>
                                    Created: {new Date(t.createdAt).toLocaleString()}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

function getStatusColor(status) {
    switch (status) {
        case "OPEN":
            return { backgroundColor: "#DBEAFE" };
        case "IN_PROGRESS":
            return { backgroundColor: "#FEF3C7" };
        case "RESOLVED":
            return { backgroundColor: "#D1FAE5" };
        default:
            return { backgroundColor: "#E5E7EB" };
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center"
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFFFFF"
    },

    loaderBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    content: {
        flex: 1,
        padding: 16
    },

    emptyBox: {
        alignItems: "center",
        padding: 40
    },

    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: "#6B7280"
    },

    ticketCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB"
    },

    ticketHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },

    ticketSubject: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1F2937"
    },

    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1F2937"
    },

    ticketIssue: {
        fontSize: 13,
        color: "#374151",
        marginBottom: 4
    },

    ticketMessage: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 8
    },

    ticketDate: {
        fontSize: 12,
        color: "#6B7280"
    }
});
