import { Tabs } from 'expo-router';
import { AnimatedTabBar } from '@/components/navigation';

/**
 * Main bottom tabs with animated custom tab bar.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <AnimatedTabBar
          {...props}
          badges={{
            // Wire real badge counts later (e.g. unread chat)
            chat: undefined,
            documents: undefined,
          }}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chat" options={{ title: 'AI Chat' }} />
      <Tabs.Screen name="documents" options={{ title: 'Documents' }} />
      <Tabs.Screen name="planner" options={{ title: 'Planner' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
