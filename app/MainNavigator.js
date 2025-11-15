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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

export default function MainNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Stocks" component={StocksScreen} />

            <Tab.Screen name="MutualFunds" component={MutualFundsScreen} />

            <Tab.Screen name="F&O" component={FnoScreen} />
            <Tab.Screen name="Portfolio" component={FnoScreen} />

            <Tab.Screen
                name="Account"
                component={user ? AccountScreen : AuthStack}
                options={{ title: "Account" }}
            />
        </Tab.Navigator>
    );
}
