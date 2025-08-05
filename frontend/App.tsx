import React from 'react';
import { View, Text, Button } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const speak = () => {
    Speech.speak("Hello! Welcome to your AI Medical Assistant.");
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>AI Medical Assistant</Text>
      <Button title="Speak" onPress={speak} />
    </View>
  );
}