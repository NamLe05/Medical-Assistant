import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../components/globalStyles';
import CustomTimePicker from '../components/CustomTimePicker';

type CreateAppointmentScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'CreateAppointment'>;
};

const CustomTextInput = ({ hint, value, onChangeText, label }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={hint}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        multiline={false}
        numberOfLines={1}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default function CreateAppointmentScreen({ navigation }: CreateAppointmentScreenProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Date/Time state
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Handlers for date/time pickers
  const handleDateChange = (date: Date) => {
    setAppointmentDate(date);
  };

  const handleStartTimeChange = (time: Date) => {
    setStartTime(time);
  };

  const handleEndTimeChange = (time: Date) => {
    setEndTime(time);
  };

  // Format time for display/storage
  const formatTime = (startTime: Date, endTime: Date): string => {
    const formatSingleTime = (time: Date): string => {
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
  };

  // Format date for display/storage
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSave = () => {
    // Validate required fields
    if (!title.trim()) {
      alert('Please enter an appointment title');
      return;
    }

    // Create appointment object
    const newAppointment = {
      id: Date.now().toString(),
      title: title.trim(),
      subtitle: location.trim() || 'Location not specified',
      date: formatDate(appointmentDate),
      time: formatTime(startTime, endTime),
      location: location.trim() || 'Location not specified',
      phone: phone.trim() || 'Phone not provided',
      notes: notes.trim() || 'No notes'
    };

    console.log('New appointment:', newAppointment);

    // TODO: Add to appointments list (when you implement useAppointments or Context)
    // addAppt(newAppointment);

    // Navigate back
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={32} color="#333" marginBottom={20} />
        </TouchableOpacity>
        <Text style={[globalStyles.headerText, styles.title]}>Create A New Appointment!</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CustomTextInput
          label="Title"
          hint="Type of appointment"
          value={title}
          onChangeText={setTitle}
        />

        <CustomTextInput
          label="Location"
          hint="Where is the appointment"
          value={location}
          onChangeText={setLocation}
        />

        <CustomTextInput
          label="Phone"
          hint="Contact phone number"
          value={phone}
          onChangeText={setPhone}
        />

        <CustomTimePicker
          label="Schedule"
          date={appointmentDate}
          startTime={startTime}
          endTime={endTime}
          onDateChange={handleDateChange}
          onStartTimeChange={handleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
        />

        <View style={styles.inputContainer}>
          <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Additional notes or instructions"
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: '15%',
    paddingBottom: '3%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50, // Extra padding at bottom
  },
  title: {
    fontSize: 24,
    color: '#333',
    textAlign: 'left',
    marginLeft: 10,
  },
  inputContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1f2937',
    width: '90%',
    height: 40,
    textAlignVertical: 'center',
  },
  notesInput: {
    height: 100,
    borderWidth: 2,
    borderRadius: 8,
    textAlignVertical: 'top',
    paddingTop: 10,
    borderBottomWidth: 2, // Override the borderBottomWidth from input style
  },
  saveButton: {
    backgroundColor: '#2E5BBA',
    marginHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});