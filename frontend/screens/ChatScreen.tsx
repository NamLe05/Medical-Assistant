import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import globalStyles from '../components/globalStyles';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple response generator (replace with actual AI API)
  const generateAIResponse = (userInput) => {
    const responses = [
      "That's an interesting question! Let me think about that.",
      "I understand what you're asking. Here's my perspective...",
      "Thanks for sharing that with me. I'd be happy to help!",
      "That's a great point. Let me provide some insights on that topic.",
      "I see what you mean. Here's how I would approach that..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakMessage = (text) => {
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9
    });
  };

  const clearChat = () => {
    setMessages([
      { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, timestamp: new Date() }
    ]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const MessageBubble = ({ message }) => (
    <View style={[
      styles.messageBubble,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </Text>
        {!message.isUser && (
          <TouchableOpacity 
            onPress={() => speakMessage(message.text)}
            style={styles.speakButton}
          >
            <Ionicons name="volume-medium-outline" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const TypingIndicator = () => (
    <View style={[styles.messageBubble, styles.aiMessage, styles.typingIndicator]}>
      <Text style={styles.typingText}>AI is typing...</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[globalStyles.rowSpacing, styles.headerContainer]}>
        <FontAwesome5 style={styles.chatIcon} name="robot" size={24} color="#2E5BBA" />
        <Text style={[globalStyles.headerText, styles.title]}>Assistant</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Ionicons name="refresh-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Ionicons style={styles.chatIcon} name="chatbox-ellipses-outline" size={30} color="#333" />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity 
          onPress={sendMessage}
          style={[
            styles.sendButton,
            inputText.trim() === '' && styles.sendButtonDisabled
          ]}
          disabled={inputText.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() === '' ? '#ccc' : '#007AFF'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: '15%', 
    paddingBottom: '3%',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginLeft: 30,
    fontWeight: '600',
  },
  clearButton: {
    padding: 5,
    marginRight: 10,
  },
  chatIcon: {
    marginLeft: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    marginLeft: '20%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    marginRight: '20%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    opacity: 0.7,
  },
  speakButton: {
    padding: 4,
    marginLeft: 8,
  },
  typingIndicator: {
    opacity: 0.7,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    marginLeft: 12,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});