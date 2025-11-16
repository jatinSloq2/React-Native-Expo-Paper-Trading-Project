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
import EditProfileScreen from './screens/AccountsScreens/Settings/EditProfileScreens';
import ChangePasswordScreen from './screens/AccountsScreens/Settings/ChangePasswordScreen';
import PrivacySecurityScreen from './screens/AccountsScreens/Settings/PrivacySecurityScreen';
import HelpCenterScreen from './screens/AccountsScreens/Settings/HelpCenterScreen';
import ContactSupportScreen from './screens/AccountsScreens/Settings/ContactSupportScreen';
import TermsConditionsScreen from './screens/AccountsScreens/Settings/TermsConditionsScreen';
import PrivacyPolicyScreen from './screens/AccountsScreens/Settings/PrivacyPolicyScreen';
import SeeYourTickets from './screens/AccountsScreens/Settings/SeeYourTickets';


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
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="YourTickets" component={SeeYourTickets} />
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

                    if (route.name === 'Home') {
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
                    height: 70,
                    paddingTop: 6,
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
                name="Home"
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

            {user &&
                <Tab.Screen
                    name="Portfolio"
                    component={Portfolio}
                    options={{ title: 'Portfolio' }}
                />

            }
            <Tab.Screen
                name="Account"
                component={user ? AccountStack : AuthStack}
                options={{ title: 'Account' }}
            />
        </Tab.Navigator>
    );
}