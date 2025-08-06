
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

// Define screen types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#2E5BBA' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
        {...({ id: undefined } as any)} // Type assertion
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }} // Hide header on welcome screen
        />
        <Stack.Screen name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}