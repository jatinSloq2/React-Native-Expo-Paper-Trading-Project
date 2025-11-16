import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Existing screens
import AccountScreen from "./screens/AccountScreen";
import LearningHubScreen from "./screens/AccountsScreens/LearningHubScreen";
import MarketWatchScreen from "./screens/AccountsScreens/MarketWatchScreen";
import SettingsScreen from "./screens/AccountsScreens/SettingsScreen";
import BalanceHistoryScreen from "./screens/AccountsScreens/BalanceHistory";
import FnoScreen from "./screens/FnOScreen";
import LoginScreen from "./screens/LoginScreen";
import MutualFundsScreen from "./screens/MutualFundsScreen";
import Portfolio from "./screens/Portfolio";
import RegisterScreen from "./screens/RegisterScreen";
import StocksScreen from "./screens/StocksScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Stack for Login/Register
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Account Stack with nested screens
const AccountStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AccountMain" component={AccountScreen} />
        <Stack.Screen name="BalanceHistory" component={BalanceHistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MarketWatch" component={MarketWatchScreen} />
        <Stack.Screen name="LearningHub" component={LearningHubScreen} />
    </Stack.Navigator>
);

export default function MainNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Stocks') {
                        iconName = 'trending-up';
                    } else if (route.name === 'MutualFunds') {
                        iconName = 'pie-chart';
                    } else if (route.name === 'F&O') {
                        iconName = 'bar-chart-2';
                    } else if (route.name === 'Portfolio') {
                        iconName = 'briefcase';
                    } else if (route.name === 'Account') {
                        iconName = 'user';
                    }

                    return <Feather name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2E5CFF',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen 
                name="Stocks" 
                component={StocksScreen}
                options={{ title: 'Stocks' }}
            />
            <Tab.Screen 
                name="MutualFunds" 
                component={MutualFundsScreen}
                options={{ title: 'Mutual Funds' }}
            />
            <Tab.Screen 
                name="F&O" 
                component={FnoScreen}
                options={{ title: 'F&O' }}
            />
            <Tab.Screen 
                name="Portfolio" 
                component={Portfolio}
                options={{ title: 'Portfolio' }}
            />
            <Tab.Screen
                name="Account"
                component={user ? AccountStack : AuthStack}
                options={{ title: 'Account' }}
            />
        </Tab.Navigator>
    );
}