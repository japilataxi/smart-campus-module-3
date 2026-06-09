import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function LoansScreen() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);

  async function loadLoans() {
    const data = await api.getLoans();
    setLoans(data.filter((loan: any) => loan.userEmail === user.email));
  }

  useEffect(() => {
    loadLoans().catch(() => setLoans([]));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Loans</Text>

      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.book}>{item.book?.title || item.bookId}</Text>
            <Text>Status: {item.returned ? "Returned" : "Active"}</Text>
            <Text>Loan Date: {item.loanDate || item.createdAt || "N/A"}</Text>
            <Text>Due Date: {item.dueDate || "N/A"}</Text>
            <Text>Return Date: {item.returned ? "Returned" : "Pending"}</Text>
          </View>
        )}
      />
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
    padding: 18,
    gap: 6,
  },
  book: {
    fontSize: 18,
    color: "#002b5c",
    fontWeight: "900",
  },
});