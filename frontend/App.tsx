// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Auth screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

// Tab screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
//import MapScreen from './screens/MapScreen';
//import SettingsScreen from './screens/SettingsScreen';

// Home Screens
import CreateAppointmentScreen from './screens/CreateAppointmentScreen';


// Define screen types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined; // This will be our tab navigator
};

export type TabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>; // Updated to include nested params
  Chat: undefined;
  Map: undefined;
  Settings: undefined;
};

// Home Stack Navigator (nested inside Home tab)
export type HomeStackParamList = {
  Home: undefined;
  CreateAppointment: undefined;
  Appointments: undefined;
  Medication: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

// Home Stack Navigator Component
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      {...({ id: "HomeStack" } as any)}
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#2E5BBA' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Hide header on main home screen
      />
      <HomeStack.Screen
        name="CreateAppointment"
        component={CreateAppointmentScreen}
        options={{
          title: 'New Appointment',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="Appointments"
        component={HomeScreen} // Replace with actual AppointmentsScreen when ready
        options={{
          title: 'All Appointments',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="Medication"
        component={HomeScreen} // Replace with actual MedicationScreen when ready
        options={{
          title: 'Medications',
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

// Bottom Tab Navigator Component
function MainTabNavigator() {
  return (
    <Tab.Navigator
      {...({ id: "MainTabs" } as any)}
      initialRouteName="HomeStack" // Changed from Home to HomeStack
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeStack') { // Changed from Home to HomeStack
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={30} color={color} padding={0} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#333',
          height: '10%',
          paddingBottom: 50, // Add bottom padding to push labels down
          paddingTop: 5,     // Optional: adjust top padding
          borderTopWidth: 1,
          borderTopColor: '#333',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 8,      // Push labels down from icons
          marginBottom: 2,   // Space from bottom edge
        },
        tabBarIconStyle: {
          marginTop: 2,      // Optional: adjust icon position
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={({ route }) => {
          // Use getFocusedRouteNameFromRoute to get the current focused route
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

          // Hide tab bar on specific screens
          const shouldHideTabBar = ['CreateAppointment', 'Appointments', 'Medication'].includes(routeName);

          return {
            tabBarLabel: 'Home',
            tabBarStyle: shouldHideTabBar
              ? { display: 'none' }
              : {
                backgroundColor: '#333',
                height: '10%',
                paddingBottom: 50,
                paddingTop: 5,
                borderTopWidth: 1,
                borderTopColor: '#333',
              }
          };
        }}
      />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Map" component={HomeScreen} />
      <Tab.Screen name="Settings" component={HomeScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        {...({ id: "StackTabs" } as any)}
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#2E5BBA' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}