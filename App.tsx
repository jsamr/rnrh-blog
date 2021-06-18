import "intl";
import "intl/locale-data/jsonp/en";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { RootStackParamList } from "./shared-types";
import HomeScreen from "./screens/HomeScreen";
import ArticleScreen from "./screens/ArticleScreen";
import WebEngine from "./components/WebEngine";
import ThemeProvider from "./utils/ThemeProvider";
import QueryProvider from "./utils/QueryProvider";
import Background from "./components/Background";

// We must disable because of a bug with a white frame, problematic in dark
// mode. See https://github.com/react-navigation/react-navigation/issues/8734
enableScreens(false);

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <WebEngine>
          <SafeAreaProvider>
            <Background>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false
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
            </Background>
          </SafeAreaProvider>
        </WebEngine>
      </ThemeProvider>
    </QueryProvider>
  );
}
