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
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setError("");
      await login(email, password);
    } catch {
      setError("Invalid credentials or API Gateway unavailable.");
    }
  }

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
          <Text style={styles.brand}>Smart Campus</Text>
          <Text style={styles.subtitle}>Universidad Central del Ecuador</Text>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Institutional email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />

            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView> 
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#eef3f8",
    justifyContent: "center",
    padding: 24,
  },
  brand: {
    fontSize: 36,
    fontWeight: "900",
    color: "#002b5c",
    textAlign: "center",
  },
  subtitle: {
    color: "#8b0000",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#002b5c",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    padding: 14,
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: 12,
    borderRadius: 12,
  },
  link: {
    textAlign: "center",
    color: "#8b0000",
    fontWeight: "800",
    marginTop: 8,
  },
});