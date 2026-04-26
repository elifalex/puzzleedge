import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Analytics } from '@vercel/analytics/react';
import Head from 'expo-router/head';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      {/* Google AdSense Verification & Setup - Web only */}
      {Platform.OS === 'web' && (
        <Head>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6082551497006632"
            crossOrigin="anonymous"
          />
        </Head>
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0F' },
        }}
      />

      {/* Vercel Analytics - only on web */}
      {Platform.OS === 'web' && <Analytics />}
    </>
  );
}
