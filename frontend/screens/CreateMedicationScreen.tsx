import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../components/globalStyles';
import CustomTimePicker from '../components/CustomTimePicker';
import { Medication, useMedications } from '../types/MedicationProvider';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

type CreateMedicationRouteProp = RouteProp<HomeStackParamList, 'CreateMedication'>;

type CreateEditMedicationScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'CreateAppointment'>;
  route: CreateMedicationRouteProp;
}

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

// CUSTOM TOGGLE
const CustomToggle = ({
  leftOption = 'Medication',
  rightOption = 'Supplement',
  onToggle,
  initialValue = 'left' // 'left' or 'right'
}) => {
  const [selectedOption, setSelectedOption] = useState(initialValue);
  const slideAnim = useRef(new Animated.Value(initialValue === 'left' ? 0 : 1)).current;

  const handleToggle = (option) => {
    if (option === selectedOption) return;

    setSelectedOption(option);

    // Animate the slider
    Animated.timing(slideAnim, {
      toValue: option === 'left' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Call the callback with the selected value
    onToggle && onToggle(option === 'left' ? leftOption : rightOption);
  };

  return (
    <View style={styles.customToggleContainer}>
      {/* Animated sliding background */}
      <Animated.View
        style={[
          styles.customToggle,
          {
            left: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['2%', '53%'],
            }),
          },
        ]}
      />

      {/* Left option */}
      <TouchableOpacity
        style={[styles.toggleOption]}
        onPress={() => handleToggle('left')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.toggleText,
          selectedOption === 'left' ? styles.selectedText : styles.unselectedText
        ]}>
          {leftOption}
        </Text>
      </TouchableOpacity>

      {/* Right option */}
      <TouchableOpacity
        style={[styles.toggleOption]}
        onPress={() => handleToggle('right')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.toggleText,
          selectedOption === 'right' ? styles.selectedText : styles.unselectedText
        ]}>
          {rightOption}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CustomPicker = ({ title, options, value, onValueChange, width }) => {
  return (
    <View style={[styles.container]}>
      <Text style={[globalStyles.headerText, styles.title, styles.inputTitle, { fontSize: 18 }]}>{title}</Text>
      <Dropdown
        style={[styles.dropdown, { width: width, marginLeft: 10 }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={options}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder="Select frequency"
        value={value}
        onChange={item => onValueChange(item.value)}
        renderRightIcon={() => (
          <Text style={styles.icon}>▼</Text>
        )}
        autoScroll={false}
      />
    </View>
  );
};

const CustomDosageInput = ({ remaining, onRemainingChange, total, onTotalChange, dosage,
  onDosageChange, dosageUnit, onDosageUnitChange, dosageType, onDosageTypeChange, freqAmnt, onFreqAmntChange, freqTimes,
  onFreqTimesChange, freqType, onFreqTypeChange }) => {

  const timesOptions = [
    { label: 'Once', value: 1 },
    { label: 'Twice', value: 2 },
    { label: 'Three times', value: 3 },
    { label: 'Four times', value: 4 },
    { label: 'Five times', value: 5 },
    { label: 'Six times', value: 6 },
  ];

  const freqTypeOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'As Needed', value: 'as-needed' },
  ];

  const amountOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  const medicationTypes = [
    { label: 'Pills', value: 'pills' },
    { label: 'Tablets', value: 'tablets' },
    { label: 'Capsules', value: 'capsules' },
    { label: 'Liquid', value: 'liquid' },
    { label: 'Injections', value: 'injections' },
    { label: 'Other', value: 'other' },
  ];

  const dosageUnits = [
    { label: 'mg', value: 'mg' },
    { label: 'g', value: 'g' },
    { label: 'ml', value: 'ml' },
    { label: 'units', value: 'units' },
    { label: '%', value: '%' },
    { label: 'drops', value: 'drops' },
  ];


  return (
    <View style={styles.inputContainer}>
      <Text style={[globalStyles.headerText, styles.title, styles.inputTitle, { marginBottom: 10 }]}>Dosage Information *</Text>

      {/* Amount Remaining/Total */}
      <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>Amount</Text>
      <View style={[globalStyles.row, { marginBottom: 10 }]}>
        <TextInput
          style={[styles.input, { width: '15%', textAlign: 'center' }]}
          placeholder={'30'}
          placeholderTextColor="#9ca3af"
          value={remaining?.toString()}
          onChangeText={onRemainingChange}
          multiline={false}
          numberOfLines={1}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType='numeric'
        />
        <Text style={[styles.inputTitle, styles.title]}>/</Text>
        <TextInput
          style={[styles.input, { width: '15%', textAlign: 'center' }]}
          placeholder={'30'}
          placeholderTextColor="#9ca3af"
          value={total?.toString()}
          onChangeText={onTotalChange}
          multiline={false}
          numberOfLines={1}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType='numeric'
        />
      </View>

      {/* Dosage */}
      <Text style={[globalStyles.headerText, styles.title, styles.inputTitle]}>Dosage</Text>
      <View style={[globalStyles.row, { marginBottom: 10 }]}>
        <TextInput
          style={[styles.input, { width: '15%', textAlign: 'center', marginTop: 15 }]}
          placeholder={'10'}
          placeholderTextColor="#9ca3af"
          value={dosage?.toString()}
          onChangeText={onDosageChange}
          multiline={false}
          numberOfLines={1}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType='numeric'
        />

        <Dropdown
          style={[styles.dropdown, { width: 90, marginLeft: 10 }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dosageUnits}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder="Select frequency"
          value={dosageUnit}
          onChange={item => onDosageUnitChange(item.value)}
          renderRightIcon={() => (
            <Text style={styles.icon}>▼</Text>
          )}
          autoScroll={false}
        />

      </View>

      {/* Type */}
      <CustomPicker
        title="Type"
        options={medicationTypes}
        value={dosageType}
        onValueChange={onDosageTypeChange}
        width={120}
      >
      </CustomPicker>

      {/* Amount and Frequency */}
      <View style={[globalStyles.rowSpacing]}>
        {/* Amount */}
        <CustomPicker
          title="Amount"
          options={amountOptions}
          value={freqAmnt}
          onValueChange={onFreqAmntChange}
          width={60}
        >
        </CustomPicker>

        {/* Freq Time */}
        <CustomPicker
          title="Frequency"
          options={timesOptions}
          value={freqTimes}
          onValueChange={onFreqTimesChange}
          width={120}
        >
        </CustomPicker>

        {/* Freq Type */}
        <CustomPicker
          title=""
          options={freqTypeOptions}
          value={freqType}
          onValueChange={onFreqTypeChange}
          width={110}
        >
        </CustomPicker>
      </View>
    </View >
  );
};

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



// CREATE EDIT MEDICATION SCREEN
// default export
// parameter: Screen Props
export default function CreateEditMedicationScreen({ navigation, route }: CreateEditMedicationScreenProps) {
  // useMedication provider
  const { addMedication, updateMedication } = useMedications();

  const colors = {
    blue: { primary: '#2E5BBA', secondary: '#3769d6ff' },
    purple: { primary: '#AA1B6E', secondary: '#C63A85' },
    green: { primary: '#2E8B57', secondary: '#4A9F6E' },
    red: { primary: '#B83E3E', secondary: '#D65555' }
  };

  // medication to edit if provided
  const medicationToEdit = route.params?.medication;
  const isEditing = !!medicationToEdit // checks if undefined

  const [name, setName] = useState(medicationToEdit?.name || '');
  const [color, setColor] = useState(medicationToEdit?.colors || colors.blue);
  const [type, setType] = useState(medicationToEdit?.type || 'medication');
  const [notes, setNotes] = useState(medicationToEdit?.notes || '');
  const [dosage, setDosage] = useState(medicationToEdit?.dosage || '');
  const [dosageUnit, setDosageUnit] = useState(medicationToEdit?.dosageUnit || 'mg')
  const [dosageType, setDosageType] = useState(medicationToEdit?.dosageType || 'pills');
  const [freqAmnt, setFreqAmnt] = useState(medicationToEdit?.frequencyAmount || 1);
  const [freqTimes, setFreqTimes] = useState(medicationToEdit?.frequencyTimes || 1);
  const [freqType, setFreqType] = useState(medicationToEdit?.frequencyType || 'daily');
  const [remaining, setRemaining] = useState(medicationToEdit?.remaining || null);
  const [total, setTotal] = useState(medicationToEdit?.total || null);
  const [timesToTake, setTimesToTake] = useState(medicationToEdit?.timesToTake || []);

  const handleColorChange = (themeName) => {
    setColor(colors[themeName]);
  };

  const handleSave = () => {
    if (!name.trim() || total == null || remaining == null!) {
      Alert.alert(
        'Error',
        'Please enter all required fields',
        [{ text: 'OK' }]
      );
      return;
    }

    const medicationData = {
      name: name.trim(),
      colors: color,
      type: type,
      notes: notes.trim(),
      dosage: dosage.trim(),
      dosageUnit: dosageUnit,
      dosageType: dosageType,
      frequencyAmount: freqAmnt,
      frequencyTimes: freqTimes,
      frequencyType: freqType,
      remaining: remaining,
      total: total,
      timesToTake: timesToTake,
      taken: false
    }

    if (isEditing) {
      updateMedication(medicationToEdit!.id, medicationData);
    } else {
      // Create new appointment
      const newMedication: Medication = {
        id: Date.now().toString(),
        ...medicationData,
      };

      addMedication(newMedication);
    }

    // Navigate back
    navigation.goBack();

  }

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
          {isEditing ? 'Edit Medication' : 'Create A New Medication!'}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <CustomToggle
          leftOption="Medication"
          rightOption="Supplement"
          initialValue={type == 'medication' ? 'left' : 'right'}
          onToggle={(selectedValue) => {
            setType(selectedValue === 'Medication' ? 'medication' : 'supplement');
          }}>
        </CustomToggle>

        <CustomTextInput
          label="Name *"
          hint="Name of Medication"
          value={name}
          onChangeText={setName}
        />

        <CustomDosageInput
          remaining={remaining}
          onRemainingChange={setRemaining}
          total={total}
          onTotalChange={setTotal}
          dosage={dosage}
          onDosageChange={setDosage}
          dosageUnit={dosageUnit}
          onDosageUnitChange={setDosageUnit}
          dosageType={dosageType}
          onDosageTypeChange={setDosageType}
          freqAmnt={freqAmnt}
          onFreqAmntChange={setFreqAmnt}
          freqTimes={freqTimes}
          onFreqTimesChange={setFreqTimes}
          freqType={freqType}
          onFreqTypeChange={setFreqType}
        />


        <View style={styles.inputContainer}>
          <Text style={[globalStyles.headerText, styles.title, styles.inputTitle, { marginBottom: 10 }]}>Notes</Text>
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

        <CustomColorSelector
          currColor={color}
          colors={colors}
          onChangeColor={handleColorChange}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}
          onPress={handleSave}>
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
    gap: 10,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 24,
    color: '#333',
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
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
  inputSmall: {
    width: '45%',
    marginBottom: 10,
  },
  customToggleContainer: {
    backgroundColor: '#333',
    width: 250,
    height: 55,
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 20,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  customToggle: {
    backgroundColor: 'white',
    width: '48%',
    height: '100%',
    borderRadius: 20,
    position: 'absolute',
    top: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleOption: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedText: {
    color: '#333',
  },
  unselectedText: {
    color: '#999',
  },

  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    width: 110,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    fontFamily: 'Nunito_400Regular',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Nunito_400Regular',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Nunito_400Regular',
  },
  icon: {
    fontSize: 12,
    color: '#333',
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