import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";

export function LibraryScreen() {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  async function loadBooks() {
    const data = await api.getBooks();
    setBooks(data);
  }

  async function requestLoan(bookId: string) {
    try {
      await api.createLoan({
        userEmail: user.email,
        bookId,
      });

      setMessage("Loan requested successfully.");
      await loadBooks();
    } catch {
      setMessage("Could not request loan.");
    }
  }

  useEffect(() => {
    loadBooks().catch(() => setBooks([]));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library Catalog</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => {
          const available = item.availableCopies ?? 0;

          return (
            <View style={styles.card}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>{item.author?.name || "Unknown author"}</Text>
              <Text>{available} copies available</Text>

              <Button
                title={available > 0 ? "Request Loan" : "No copies available"}
                disabled={available <= 0}
                onPress={() => requestLoan(item.id)}
              />
            </View>
          );
        }}
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
  message: {
    backgroundColor: "#f4c43033",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    color: "#002b5c",
    fontWeight: "800",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  bookTitle: {
    fontSize: 20,
    color: "#002b5c",
    fontWeight: "900",
  },
});