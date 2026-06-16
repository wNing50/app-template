import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Template Home</Text>
      <Text style={styles.body}>
        Keep this screen small while you shape the real product. The stack
        already includes navigation, environment config, API helpers, tests,
        Android build scripts, and deployment scaffolding.
      </Text>
      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.secondaryText}>Profile</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.secondaryText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: "700",
  },
});
