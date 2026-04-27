import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '../src/components/navigation/Header';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <View style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
        <Header />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0A0A0F' },
          }}
        />
      </View>

      {/* Vercel Analytics - only on web */}
      {Platform.OS === 'web' && <Analytics />}
    </>
  );
}
