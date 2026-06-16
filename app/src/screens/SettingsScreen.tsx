import { StyleSheet, Text, View } from "react-native";
import { apiBaseUrl, appEnv } from "../config/env";
import { colors } from "../theme/colors";

export function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Environment</Text>
        <Text style={styles.value}>{appEnv}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>API base URL</Text>
        <Text style={styles.value}>{apiBaseUrl || "Not configured"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  row: {
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  value: {
    color: colors.text,
    fontSize: 15,
  },
});
