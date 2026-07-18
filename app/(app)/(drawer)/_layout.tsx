import { Drawer } from 'expo-router/drawer';
import { useTheme } from '@/providers';
import { DrawerContent } from '@/components/navigation/DrawerContent';

/**
 * Optional drawer wrapping the main tab navigator.
 */
export default function DrawerLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 300,
        },
        overlayColor: theme.colors.overlay,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Learnixo',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
