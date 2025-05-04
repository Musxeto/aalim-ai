import React, { useContext, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native';
import * as SystemUI from 'expo-system-ui';

function AppLayout() {
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDarkMode ? '#202123' : '#F7F7F8');
  }, [isDarkMode]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#202123' : '#F7F7F8' }}>
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
