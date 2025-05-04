import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native';

function AppLayout() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#343541' : '#F7F7F8' }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
