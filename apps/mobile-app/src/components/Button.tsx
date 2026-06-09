import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export function Button({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#002b5c",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#94a3b8",
  },
  text: {
    color: "white",
    fontWeight: "800",
  },
});