import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import globalStyles from './globalStyles';

interface CustomTimePickerProps {
  label: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (time: Date) => void;
  onEndTimeChange: (time: Date) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  date,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange
}) => {

  const onDatePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const onStartTimePickerChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      onStartTimeChange(selectedTime);
    }
  };

  const onEndTimePickerChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      onEndTimeChange(selectedTime);
    }
  };

  const DatePicker = (
    <DateTimePicker
      style={styles.timePicker}
      testID="datePicker"
      value={date}
      mode="date"
      display="default"
      themeVariant="light"
      textColor="#333"
      accentColor="#333"
      onChange={onDatePickerChange}
    />
  );

  const StartTimePicker = (
    <DateTimePicker
      style={styles.timePicker}
      testID="startTimePicker"
      value={startTime}
      mode="time"
      is24Hour={false}
      display="default"
      themeVariant="light"
      textColor="#333"
      accentColor="#333"
      onChange={onStartTimePickerChange}
    />
  );

  const EndTimePicker = (
    <DateTimePicker
      style={styles.timePicker}
      testID="endTimePicker"
      value={endTime}
      mode="time"
      is24Hour={false}
      display="default"
      themeVariant="light"
      textColor="#333"
      accentColor="#333"
      onChange={onEndTimePickerChange}
    />
  );

  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.headerText, styles.title, { marginBottom: 10 }]}>{label}</Text>
      <View style={globalStyles.rowSpacing}>

        <View style={globalStyles.column}>
          <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>Date</Text>
          {DatePicker}
        </View>

        <View style={globalStyles.columnCentered}>
          <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>Start Time</Text>
          {StartTimePicker}
        </View>

        <View style={globalStyles.columnCentered}>
          <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>End Time</Text>
          {EndTimePicker}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: '#333',
    textAlign: 'left',
    marginLeft: 10,
  },
  inputContainer: {
    paddingHorizontal: 25,
    height: 120, // Fixed height instead of percentage
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 16,
    marginBottom: 5
  },
  timePicker: {
    transform: [{ scale: 1 }],
    color: "#333"
  }
});

export default CustomTimePicker;