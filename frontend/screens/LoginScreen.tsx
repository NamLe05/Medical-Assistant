import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <View style={styles.container}>
        <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Welcome back! Let's keep your health on track together.</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            multiline={false}           
            numberOfLines={1}          
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            multiline={false}           
            numberOfLines={1}           
            secureTextEntry={true}     
            autoCapitalize="none"
            autoCorrect={false}
        />
        <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('MainTabs')}
        >
            <Text style={styles.loginTitle}>Login</Text>
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
  backButton: {
    position: 'absolute',
    top: 60,        
    left: 20,       
    zIndex: 1,      
    padding: 10,    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 40,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#f5f5f5ff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    width: '80%',             
    height: 56,                 
    marginBottom: 30,           
    textAlignVertical: 'center', 
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

})