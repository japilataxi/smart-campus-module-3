import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export function DashboardScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>SMART CAMPUS MODULE 3</Text>
        <Text style={styles.title}>Welcome, {user?.firstName}</Text>
        <Text style={styles.subtitle}>
          Mobile interface connected through API Gateway.
        </Text>
      </View>

      <Pressable style={styles.card} onPress={() => navigation.navigate("Library")}>
        <Text style={styles.cardTitle}>Library Catalog</Text>
        <Text>Explore books and request loans.</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate("Loans")}>
        <Text style={styles.cardTitle}>My Loans</Text>
        <Text>Review your current book loans.</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.cardTitle}>Profile</Text>
        <Text>View authenticated user information.</Text>
      </Pressable>

      <Pressable style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eef3f8",
    gap: 16,
  },
  hero: {
    backgroundColor: "#002b5c",
    borderRadius: 26,
    padding: 24,
  },
  kicker: {
    color: "#f4c430",
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
  },
  subtitle: {
    color: "white",
    marginTop: 8,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
  cardTitle: {
    color: "#002b5c",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  logout: {
    marginTop: "auto",
    backgroundColor: "#8b0000",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "900",
  },
});