import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { LibraryScreen } from "./src/screens/LibraryScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { LoansScreen } from "./src/screens/LoansScreen";
import { IncidentsScreen } from "./src/screens/IncidentsScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Library: undefined;
  Loans: undefined;
  Profile: undefined;
  Incidents: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#002b5c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Library" component={LibraryScreen} />
            <Stack.Screen name="Loans" component={LoansScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Incidents" component={IncidentsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}