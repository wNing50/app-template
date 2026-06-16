import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.body}>
        Replace this placeholder with account details, preferences, and
        authenticated user actions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
});
