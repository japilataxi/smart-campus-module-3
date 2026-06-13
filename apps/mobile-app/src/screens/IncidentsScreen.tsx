import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { api } from "../lib/api";
import { Button } from "../components/Button";

export function IncidentsScreen() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  async function loadIncidents() {
    const data = await api.getIncidents();
    setIncidents(data);
  }

  async function createIncident() {
    try {
      await api.createIncident({ title, description, location });
      setTitle("");
      setDescription("");
      setLocation("");
      setMessage("Incident created successfully.");
      await loadIncidents();
    } catch {
      setMessage("Could not create incident.");
    }
  }

  useEffect(() => {
    loadIncidents().catch(() => setIncidents([]));
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Campus Incidents</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.card}>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
            <Button title="Create Incident" onPress={createIncident} />
          </View>

          <FlatList
            data={incidents}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ gap: 12, marginTop: 16 }}
            renderItem={({ item }) => (
              <View style={styles.incident}>
                <Text style={styles.incidentTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>{item.location}</Text>
                <Text>Status: {item.status}</Text>
              </View>
            )}
          />
         </View> 
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#eef3f8" },
  title: { fontSize: 30, fontWeight: "900", color: "#002b5c", marginBottom: 16 },
  card: { backgroundColor: "white", padding: 18, borderRadius: 20, gap: 10 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 14, padding: 14 },
  message: { backgroundColor: "#f4c43033", padding: 12, borderRadius: 12, marginBottom: 12 },
  incident: { backgroundColor: "white", padding: 16, borderRadius: 18 },
  incidentTitle: { fontSize: 18, fontWeight: "900", color: "#002b5c" },
});