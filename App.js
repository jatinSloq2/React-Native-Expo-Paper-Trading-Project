import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./app/MainNavigator";
import AuthProvider from "./context/AuthContext";
import { CryptoProvider } from "./context/CryptoContext";

export default function App() {
  return (
    <CryptoProvider>
      <AuthProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </CryptoProvider>
  );
}
