import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../components/globalStyles';
import CustomTimePicker from '../components/CustomTimePicker';
import { Appointment, useAppointments } from '../types/AppointmentProvider';

// Update the param list to include optional appointment
type CreateEditAppointmentRouteProp = RouteProp<HomeStackParamList, 'CreateAppointment'>;

type CreateEditAppointmentScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'CreateAppointment'>;
  route: CreateEditAppointmentRouteProp;
};

// CUSTOM TEXT INPUT
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

// CUSTOM COLOR SELECTOR
// maps colors to color buttons
const CustomColorSelector = ({ currColor, colors, onChangeColor }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>Color</Text>
      <View style={styles.customColorRow}>
        {Object.keys(colors).map((color, index) => (
          <CustomColorButton
            key={color}
            color={colors[color].primary}
            isSelected={colors[color].primary == currColor.primary}
            onChangeColor={() => onChangeColor(color)}>
          </CustomColorButton>
        ))}
      </View>
    </View>
  );
}

const CustomColorButton = ({ color, isSelected, onChangeColor }) => {
  return (
    <TouchableOpacity
      style={[styles.colorButton, { backgroundColor: color }, isSelected && styles.selectedColorButton]}
      onPress={onChangeColor}>
    </TouchableOpacity>
  );
}


export default function CreateEditAppointmentScreen({ navigation, route }: CreateEditAppointmentScreenProps) {
  const { addAppt, updateAppt } = useAppointments();
  const colors = {
    blue: { primary: '#2E5BBA', secondary: '#3769d6ff' },
    purple: { primary: '#AA1B6E', secondary: '#C63A85' },
    green: { primary: '#2E8B57', secondary: '#4A9F6E' },
    red: { primary: '#B83E3E', secondary: '#D65555' }
  };

  // Check if we're editing an existing appointment
  const appointmentToEdit = route.params?.appointment;
  const isEditing = !!appointmentToEdit;

  // Helper function to parse time string back to Date objects
  const parseTimeString = (timeString: string): { start: Date, end: Date } => {
    const [startStr, endStr] = timeString.split(' - ');
    const today = new Date();

    const parseTime = (timeStr: string): Date => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(today);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    return {
      start: parseTime(startStr),
      end: parseTime(endStr)
    };
  };

  // Simple date parsing from ISO string - no more complex parsing needed!
  const parseStoredDate = (isoString: string): Date => {
    return new Date(isoString);
  };

  // Form state - initialize with existing appointment data if editing
  const [title, setTitle] = useState(appointmentToEdit?.title || '');
  const [location, setLocation] = useState(appointmentToEdit?.subtitle || '');
  const [address, setAddress] = useState(appointmentToEdit?.location === 'N/A' ? '' : appointmentToEdit?.location || '');
  const [phone, setPhone] = useState(appointmentToEdit?.phone === 'N/A' ? '' : appointmentToEdit?.phone || '');
  const [notes, setNotes] = useState(appointmentToEdit?.notes === 'N/A' ? '' : appointmentToEdit?.notes || '');
  const [color, setColor] = useState(appointmentToEdit?.colors || colors.blue)

  // Date/Time state
  const [appointmentDate, setAppointmentDate] = useState(() => {
    if (appointmentToEdit?.date) {
      try {
        // If it's already an ISO string, parse it directly
        return parseStoredDate(appointmentToEdit.date);
      } catch {
        return new Date();
      }
    }
    return new Date();
  });

  const [startTime, setStartTime] = useState(() => {
    if (appointmentToEdit?.time) {
      try {
        return parseTimeString(appointmentToEdit.time).start;
      } catch {
        return new Date();
      }
    }
    return new Date();
  });

  const [endTime, setEndTime] = useState(() => {
    if (appointmentToEdit?.time) {
      try {
        return parseTimeString(appointmentToEdit.time).end;
      } catch {
        const defaultEnd = new Date();
        defaultEnd.setHours(defaultEnd.getHours() + 1);
        return defaultEnd;
      }
    }
    const defaultEnd = new Date();
    defaultEnd.setHours(defaultEnd.getHours() + 1);
    return defaultEnd;
  });

  // Handlers
  const handleDateChange = (date: Date) => {
    setAppointmentDate(date);
  };

  const handleStartTimeChange = (time: Date) => {
    setStartTime(time);
  };

  const handleEndTimeChange = (time: Date) => {
    setEndTime(time);
  };

  const handleColorChange = (themeName) => {
    console.log('print')
    setColor(colors[themeName]);
  };


  // Format time for display/storage (this stays the same)
  const formatTime = (startTime: Date, endTime: Date): string => {
    const formatSingleTime = (time: Date): string => {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
  };

  // Format date for STORAGE - ISO string for easy parsing
  const formatDateForStorage = (date: Date): string => {
    return date.toISOString();
  };

  const handleSave = () => {
    // Validate required fields
    if (!title.trim() || !location.trim()) {
      Alert.alert(
        'Error',
        'Please enter all required fields',
        [{ text: 'OK' }]
      );
      return;
    }

    const appointmentData = {
      title: title.trim(),
      subtitle: location.trim(),
      date: formatDateForStorage(appointmentDate), // Store as ISO string
      time: formatTime(startTime, endTime),
      location: address.trim() || 'N/A',
      phone: phone.trim() || 'N/A',
      notes: notes.trim() || 'N/A',
      colors: color,
    };

    if (isEditing) {
      updateAppt(appointmentToEdit!.id, appointmentData);
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...appointmentData
      };

      addAppt(newAppointment);
    }

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
          <Ionicons name="chevron-back" size={32} color="#333" marginBottom={10} />
        </TouchableOpacity>
        <Text style={[globalStyles.headerText, styles.title]}>
          {isEditing ? 'Edit Appointment' : 'Create A New Appointment!'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <CustomTextInput
          label="Title *"
          hint="Type of appointment"
          value={title}
          onChangeText={setTitle}
        />

        <CustomTextInput
          label="Location *"
          hint="Where is the appointment"
          value={location}
          onChangeText={setLocation}
        />

        <CustomTextInput
          label="Address"
          hint="Where is the appointment"
          value={address}
          onChangeText={setAddress}
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

        <CustomColorSelector
          currColor={color}
          colors={colors}
          onChangeColor={handleColorChange}
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
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Appointment' : 'Save Appointment'}
          </Text>
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
    marginBottom: 10,
  },
  inputContainer: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 18,
    marginBottom: 0,
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
    marginBottom: 5,
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
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  colorButton: {
    borderRadius: 25,
    width: 48,
    height: 48,
  },

  customColorRow: {
    flexDirection: 'row',
    alignItems: 'center',     // vertical alignment
    justifyContent: 'space-between', // horizontal spacing
    marginHorizontal: 50,
    paddingVertical: 15,
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: '#333'
  }



});