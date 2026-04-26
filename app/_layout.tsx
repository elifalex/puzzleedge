import '../global.css';
import { Stack } from 'expo-router';
import { Head } from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <>
      {/* Google AdSense Verification & Setup */}
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6082551497006632"
          crossOrigin="anonymous"
        />
      </Head>

      <StatusBar style="light" />
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
