import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';


type WelcomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Your all-in-one health partner</Text>
      
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginTitle}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.registerTitle}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 50,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2E5BBA',
    paddingHorizontal: 100,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    //shadow
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    borderBottomWidth: 4,
    borderBottomColor: '#003ab8ff',
    
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  registerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 90,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#2E5BBA",
    borderBottomWidth: 4,
    borderBottomColor: '#003ab8ff',
  },
  registerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E5BBA',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 2,
  }
});