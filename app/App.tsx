import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthScreen } from "./src/screens/AuthScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { colors } from "./src/theme/colors";
import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => setSignedIn(false), []);

  const headerRight = useMemo(
    () => (
      <Pressable onPress={signOut} style={styles.headerButton}>
        <Text style={styles.headerButtonText}>Sign out</Text>
      </Pressable>
    ),
    [signOut],
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          {!signedIn ? (
            <Stack.Screen name="Auth" options={{ title: "App Template" }}>
              {(props) => <AuthScreen {...props} onSignIn={signIn} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Home", headerRight: () => headerRight }}
              />
              <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },
});
