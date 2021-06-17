import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./shared-types";
import HomeScreen from "./screens/HomeScreen";
import ArticleScreen from "./screens/ArticleScreen";
import WebEngine from "./components/WebEngine";
import ThemeProvider from "./utils/ThemeProvider";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <WebEngine>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="Home"
                options={{ title: "Blog" }}
                component={HomeScreen}
              />
              <Stack.Screen
                name="Article"
                options={{ headerShown: true }}
                component={ArticleScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </WebEngine>
    </ThemeProvider>
  );
}
