import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "Kevin",
    lastName: "Amaguaña",
    email: "kevin.amaguana@uce.edu.ec",
    password: "Password123",
  });

  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleRegister() {
    if (!form.email.endsWith("@uce.edu.ec")) {
      setError("Only @uce.edu.ec emails are allowed.");
      return;
    }

    try {
      setError("");
      await register(form);
    } catch {
      setError("Registration failed.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="First name"
        value={form.firstName}
        onChangeText={(value) => updateField("firstName", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={form.lastName}
        onChangeText={(value) => updateField("lastName", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Institutional email"
        value={form.email}
        onChangeText={(value) => updateField("email", value)}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={(value) => updateField("password", value)}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} />

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
    justifyContent: "center",
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#002b5c",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "white",
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
  },
});