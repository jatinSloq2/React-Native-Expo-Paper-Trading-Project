import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "./context/AuthContext";
import MainNavigator from "./app/MainNavigator";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
