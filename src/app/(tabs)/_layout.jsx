import { Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { 
  Home, 
  Utensils, 
  Scan, 
  Bot, 
  User,
  Plus 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAivyTheme from '@/utils/theme';

// Custom AI Scanner Tab Button
function AIScannerButton({ onPress, isFocused }) {
  const theme = useAivyTheme();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        top: -15,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.shadows.glow,
        }}
      >
        <Scan size={30} color={theme.colors.textInverse} />
      </LinearGradient>
      
      {/* Pulse effect when focused */}
      {isFocused && (
        <View
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            borderRadius: 45,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            opacity: 0.3,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const theme = useAivyTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderColor: theme.colors.border,
          paddingBottom: 10,
          paddingTop: 15,
          height: 90,
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          ...theme.shadows.lg,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          fontFamily: 'Inter_500Medium',
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? `${theme.colors.primary}20` : 'transparent',
              }}
            >
              <Home color={color} size={24} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="diet-plan"
        options={{
          title: 'Diet Plan',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? `${theme.colors.primary}20` : 'transparent',
              }}
            >
              <Utensils color={color} size={24} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="ai-scanner"
        options={{
          title: 'AI Scanner',
          tabBarButton: (props) => (
            <AIScannerButton
              onPress={props.onPress}
              isFocused={props.accessibilityState?.selected}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="ai-coach"
        options={{
          title: 'AI Coach',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? `${theme.colors.primary}20` : 'transparent',
              }}
            >
              <Bot color={color} size={24} />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? `${theme.colors.primary}20` : 'transparent',
              }}
            >
              <User color={color} size={24} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}