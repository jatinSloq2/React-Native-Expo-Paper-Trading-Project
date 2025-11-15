import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AccountScreen from "./screens/AccountScreen";
import StocksScreen from "./screens/StocksScreen";
import MutualFundsScreen from "./screens/MutualFundsScreen";
import FnoScreen from "./screens/FnOScreen";
import Portfolio from "./screens/Portfolio";
import BalanceHistoryScreen from "./screens/BalanceHistory";

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
    </Stack.Navigator>
);

export default function MainNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Stocks" component={StocksScreen} />
            <Tab.Screen name="MutualFunds" component={MutualFundsScreen} />
            <Tab.Screen name="F&O" component={FnoScreen} />
            <Tab.Screen name="Portfolio" component={Portfolio} />
            <Tab.Screen
                name="Account"
                component={user ? AccountStack : AuthStack}
                options={{ title: "Account" }}
            />
        </Tab.Navigator>
    );
}