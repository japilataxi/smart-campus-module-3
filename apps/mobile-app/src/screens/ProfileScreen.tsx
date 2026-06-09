import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { normalizeRoles } from "../lib/roles";

export function ProfileScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <View style={styles.card}>
        <ProfileRow label="First Name" value={user?.firstName} />
        <ProfileRow label="Last Name" value={user?.lastName} />
        <ProfileRow label="Email" value={user?.email} />
        <ProfileRow label="Roles" value={normalizeRoles(user).join(", ")} />
      </View>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Not available"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eef3f8",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#002b5c",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  row: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 14,
  },
  label: {
    color: "#64748b",
    fontSize: 12,
  },
  value: {
    color: "#002b5c",
    fontWeight: "900",
    marginTop: 4,
  },
});