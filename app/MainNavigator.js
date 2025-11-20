import { Feather, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// Existing screens
import AccountScreen from "./screens/AccountScreen";
import BalanceHistoryScreen from "./screens/AccountsScreens/BalanceHistory";
import LearningHubScreen from "./screens/AccountsScreens/LearningHubScreen";
import MarketWatchScreen from "./screens/AccountsScreens/MarketWatchScreen";
import ChangePasswordScreen from './screens/AccountsScreens/Settings/ChangePasswordScreen';
import ContactSupportScreen from './screens/AccountsScreens/Settings/ContactSupportScreen';
import EditProfileScreen from './screens/AccountsScreens/Settings/EditProfileScreens';
import HelpCenterScreen from './screens/AccountsScreens/Settings/HelpCenterScreen';
import NotificationPreferencesScreen from './screens/AccountsScreens/Settings/NotificationPreferencesScreen';
import PrivacyPolicyScreen from './screens/AccountsScreens/Settings/PrivacyPolicyScreen';
import PrivacySecurityScreen from './screens/AccountsScreens/Settings/PrivacySecurityScreen';
import SeeYourTickets from './screens/AccountsScreens/Settings/SeeYourTickets';
import TermsConditionsScreen from './screens/AccountsScreens/Settings/TermsConditionsScreen';
import SettingsScreen from "./screens/AccountsScreens/SettingsScreen";
import FnoScreen from "./screens/FnOScreen";
import LoginScreen from "./screens/LoginScreen";
import Positions from './screens/Positions';
import RegisterScreen from "./screens/RegisterScreen";
import StocksDetailsScreen from "./screens/StocksDetailsScreen";
import StocksScreen from "./screens/StocksScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Auth Stack for Login/Register
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="LearningHub" component={LearningHubScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
);

// Home Stack with Stocks and Details
const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StocksMain" component={StocksScreen} />
        <Stack.Screen name="CryptoDetails" component={StocksDetailsScreen} />
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
        <Stack.Screen name="CryptoDetails" component={StocksDetailsScreen} />
        <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
    </Stack.Navigator>
);

export default function MainNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    switch (route.name) {
                        case 'Home':
                            return <Feather name="trending-up" size={size} color={color} />;

                        case 'F&O':
                            return <MaterialIcons name="stacked-line-chart" size={size} color={color} />;

                        case 'Position':
                            return <MaterialIcons name="list-alt" size={size} color={color} />;

                        case 'Account':
                            return <Feather name="user" size={size} color={color} />;

                        default:
                            return <Feather name="circle" size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#2E5CFF',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    height: 75,
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
                component={HomeStack}
                options={{ title: 'Crypto' }}
            />
            <Tab.Screen
                name="F&O"
                component={FnoScreen}
                options={{ title: 'F&O' }}
            />

            {user &&
                <Tab.Screen
                    name="Position"
                    component={Positions}
                    options={{ title: 'Positions' }}
                />
            }

            <Tab.Screen
                key={user ? 'account-logged-in' : 'account-logged-out'}
                name="Account"
                component={user ? AccountStack : AuthStack}
                options={{ title: 'Account' }}
            />
        </Tab.Navigator>
    );
}