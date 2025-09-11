import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../components/globalStyles';
import { cardStyles } from '../components/AppointmentCardStack';
import CustomTimePicker from '../components/CustomTimePicker';
import { Appointment, useAppointments } from '../types/AppointmentProvider'

type AppointmentScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'Appointments'>;
};


export default function Appointments({ navigation }: AppointmentScreenProps) {
  const { appointments, removeAppt } = useAppointments();

  const handleAppointmentPress = (appointment: Appointment) => {
    // Handle appointment press - maybe navigate to details or open modal
    console.log('Pressed appointment:', appointment.title);
  };

  const handleDeletePress = (appointment: Appointment) => {
    Alert.alert(
      "Delete",
      `Are you sure you want to delete "${appointment.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeAppt(appointment.id)
        }
      ]
    );
  }


  const emptyAppointmentCard = () => (
    <View style={[cardStyles.cardStack, { marginBottom: 100 }]}>
      <TouchableOpacity
        style={[cardStyles.emptyAppointmentCard, globalStyles.columnCentered]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CreateAppointment')}
      >
        <View style={{ alignItems: 'center' }}>
          <Ionicons name="add" size={48} color="black" />
          <Text style={[globalStyles.cardTitleText, { marginTop: 10, color: '#333' }]}>Add New</Text>
        </View>
      </TouchableOpacity>
    </View>
  )

  const renderAppointmentCard = (appointment: Appointment, index: number) => (
    <View key={appointment.id} style={[cardStyles.cardStack, { marginBottom: 40 }]}>
      <TouchableOpacity
        style={cardStyles.appointmentCard}
        activeOpacity={0.8}
        onPress={() => handleAppointmentPress(appointment)}
      >
        <View style={globalStyles.row}>
          <Ionicons name="notifications-circle" marginRight={10} color="white" size={60} />
          <View style={globalStyles.column}>
            <Text style={globalStyles.cardTitleText}>{appointment.title}</Text>
            <Text style={globalStyles.cardSubtitleText}>{appointment.subtitle}</Text>
          </View>
          <TouchableOpacity style={[styles.topButtons, { marginLeft: '80%' }]}>
            <Ionicons name="create" size={32} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.topButtons, { marginLeft: '92%' }]}
            onPress={() => handleDeletePress(appointment)}>
            <Ionicons name="trash" size={32} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={cardStyles.appointmentDateContainer}>
          <Ionicons name="calendar-outline" size={22} color="white" />
          <Text style={globalStyles.cardSubtitleText}>{appointment.date}</Text>
          <View style={cardStyles.appointmentDateDivider}></View>
          <Ionicons name="time-outline" size={22} color="white" />
          <Text style={globalStyles.cardSubtitleText}>{appointment.time}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <View style={[styles.headerContainer]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={32} color="#333" />
          </TouchableOpacity>
          <Text style={[globalStyles.sectionTitleText, styles.title]}>Appointments</Text>
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {appointments.map((appointment, index) => renderAppointmentCard(appointment, index))}
        {emptyAppointmentCard()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: '15%',
    paddingBottom: '3%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginTop: 0,
    paddingTop: 6
  },
  spacer: {
    width: 32, // Same width as the back icon to balance
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: '5%',// Extra padding at bottom
    paddingTop: '10%',
  },

  topButtons: {
    borderRadius: 25,  // Half of width/height for perfect circle
    width: 32,
    height: 32,
    marginLeft: '92%',
    marginBottom: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

});