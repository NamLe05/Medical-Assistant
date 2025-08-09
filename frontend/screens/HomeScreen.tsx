import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Animated, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { BlurView } from 'expo-blur';
import globalStyles from '../components/globalStyles';import ModalAppointmentCard from '../components/ModalAppointmentCard';
import { Appointment, AppointmentList, useAppointments } from '../types/AppointmentType'
import AppointmentCardStack from '../components/AppointmentCardStack';
import { HomeStackParamList } from '../App'
import { DateTime } from '../types/DateTime';



const mockAppointment: Appointment = {
  id: '1',
  title: 'Cardiology Appointment',
  subtitle: 'Johns Hopkins Hospital',
  date: 'Friday, 8 August',
  time: '09:00 - 10:00',
  location: '1800 Orleans St, Baltimore, MD 21287',
  phone: '(410) 955-5000',
  notes: 'Bring referral and insurance'
};


type HomeScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation}: HomeScreenProps) {
  const { appointments, addAppt, removeAppt, updateAppt } = useAppointments();

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [slideAnim] = useState(new Animated.Value(300));
  const date = new DateTime()

  useEffect(() => {
    if (appointments.length === 0) {
      addAppt(mockAppointment);
      addAppt(mockAppointment);
      addAppt(mockAppointment);
    }
  }, [appointments.length, addAppt]);

  // Use the first appointment from props, or fallback to mock data
  const displayAppointment = appointments.length > 0 ? appointments[0] : null;
  const totalAppointments = appointments.length;
  console.log(totalAppointments)

  const handleAppointmentPress = (appointment: Appointment) => {
    if (appointment == null) {
      navigation.navigate('CreateAppointment')
    } else {
      setSelectedAppointment(appointment);
      setIsCardExpanded(true);
    }
  };

  useEffect(() => {
    if (isCardExpanded) {
      // Slide up when opening
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down when closing
      Animated.spring(slideAnim, {
        toValue: 300,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isCardExpanded]);

  let [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold
  });

  // HEADER
  const HeaderSection = (
    <View style={styles.headerContainer}>
      <View style={globalStyles.rowSpacing}>
        <Text style={[globalStyles.headerText, styles.date]}>{date.getFormattedDate()}</Text>
        <View style={globalStyles.column}>
          <Text style={[globalStyles.headerText, styles.weather]}>Sunny</Text>
          <Text style={[globalStyles.headerText, styles.weather]}>70°F</Text>
        </View>
        <Ionicons name="sunny" marginLeft={10} size={24} color="#FFA500" />
      </View>
      <Text style={[globalStyles.headerText, styles.title]}>Good morning, Nam</Text>
      <View style={globalStyles.divider} />
    </View>
  );

  // APPOINTMENTS
  const AppointmentSection = (
    <View style={styles.sectionContainer}>
      <View style={globalStyles.rowSpacing}>
        <Text style={globalStyles.sectionTitleText}>Upcoming Appointments</Text>
        <TouchableOpacity onPress={() => handleAppointmentPress(displayAppointment)}></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAppointment')}>
          <Ionicons name="menu" marginTop={10} size={24} color='#333' />
        </TouchableOpacity>
      </View>
            
      <AppointmentCardStack
        appointment={displayAppointment}
        totalAppointments={totalAppointments}
        onPress={handleAppointmentPress}
      />
    </View>
  );

  // Medications
  const MedicationSection = (
    <View style={styles.sectionContainer}>
      <View style={globalStyles.rowSpacing}>
        <Text style={globalStyles.sectionTitleText}>Medication</Text>
        <Ionicons name="menu" marginTop={10} size={24} color='#333' />
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          minWidth: '100%',  // This is key
          paddingHorizontal: 0
        }}>

          <TouchableOpacity style={[styles.medicationCard, { marginRight: 15, backgroundColor: '#2E5BBA' }]}>
            <FontAwesome5 name="pills" size={30} color="white" />
            <Text style={[globalStyles.cardTitleText, { marginTop: 10 }]}>Claratin</Text>
            <Text style={[globalStyles.cardSubtitleText]}>1 pill, 15 mg.</Text>
            <Text style={[globalStyles.cardSubtitleText]}>25/30</Text>
            <View style={styles.medicineStatusButton}>
              <Text style={[globalStyles.cardTitleText, { color: '#2E5BBA' }]}>Take</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.medicationCard, { marginRight: 15, backgroundColor: '#aa1b6eff' }]}>
            <View style={styles.checkmarkOverlay}>
              <Ionicons name="checkmark-circle" size={40} color="#10b91eff" />
            </View>
            <FontAwesome5 name="prescription-bottle-alt" size={30} color="white" />
            <Text style={[globalStyles.cardTitleText, { marginTop: 10 }]}>Vitamin D</Text>
            <Text style={[globalStyles.cardSubtitleText]}>1 pill, 500 mg.</Text>
            <Text style={[globalStyles.cardSubtitleText]}>60/90</Text>

            <View style={styles.medicineStatusButton}>
              <Text style={[globalStyles.cardTitleText, { color: '#aa1b6eff' }]}>Taken</Text>

            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.medicationCard, globalStyles.columnCentered, { marginRight: 15, borderWidth: 2, borderColor: '#333',  alignItems: 'center' }]}>
            <Ionicons name="add" size={48} color="black" />
            <Text style={[globalStyles.cardTitleText, { marginTop: 10, color: '#333'}]}>Add New</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
      <View style={globalStyles.container}>
        <ScrollView style={globalStyles.container}>
          {HeaderSection}

          {AppointmentSection}

          {MedicationSection}


          <View style={styles.sectionContainer}>
            <View style={globalStyles.rowSpacing}>
              <Text style={globalStyles.sectionTitleText}>Feed</Text>
              <Ionicons name="menu" marginTop={10} size={24} color='#333'/>
            </View>

            <View style={styles.feedArticle}></View>
          </View>
        </ScrollView>


      <Modal
        visible={isCardExpanded}
        transparent={true}
        animationType="fade" // Overall fade for blur
        onRequestClose={() => setIsCardExpanded(false)}
      >
        <BlurView style={styles.blurBackground} intensity={80} tint="light">
          <TouchableOpacity
            style={styles.dismissArea}
            onPress={() => setIsCardExpanded(false)}
          />
        </BlurView>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <ModalAppointmentCard
            title="Cardiology Appointment"
            subtitle="Johns Hopkins Hospital"
            date="Friday, 8 August"
            time="09:00 PM - 10:00 PM"
            location="1800 Orleans St, Baltimore, MD 21287"
            phone="(410) 955-5000"
            notes="Bring referral and insurance"
          />
        </Animated.View>
      </Modal>
      </View>
  );    
}

const styles = StyleSheet.create({
  // Header Container
  headerContainer: {
    alignItems: 'flex-start',
    marginTop: 60,
    marginLeft: 30,
  },
  date: {
    color: '#2E5BBA',
    marginRight: 200
  },
  weather: {
    color: '#aaa',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  sectionContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: '5%'
  },
  expandIcon: {
    marginLeft: 50
  },
  cardStack: {
  position: 'relative',
  width: '100%',
  height: 160,
  },
  cardShadowLayer: {
    position: 'absolute',
    top: 8,    
    left: 8,   
    right: -8,  
    bottom: 0, 
    borderRadius: 22, 
    backgroundColor: '#1e3d80ff', 
    zIndex: 0,
  },
  appointmentCard: {
    borderRadius: 20,              // More rounded
    padding: 10,
    width: '100%',
    height: 150,
    backgroundColor: '#2E5BBA',
  },
  appointmentDateContainer: {
    flexDirection: 'row',         
    gap: 12, 
    alignItems: 'center', 
    borderRadius: 20,
    paddingLeft: 20,
    width: '96%',
    height: '45%',
    margin: '2%',
    backgroundColor: '#3769d6ff',
  },
  appointmentDateDivider: {
    height: '60%',
    backgroundColor: '#ffffff',
    width: 1,
    marginHorizontal: 5, 
    marginVertical: 5,
  },
  
  // Medication
  medicationCard: {
    borderRadius: 20,              // More rounded
    padding: 15,
    width: 140,
    height: 200,
  },
  medicineStatusButton: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: '15%', 
    marginLeft: 5,
    width: '90%',
    height: '25%',
    backgroundColor: '#ffffff'
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    right: -10,
    zIndex: 10,
  },
  feedArticle: {
    borderRadius: 20,              // More rounded
    padding: 10,
    width: '100%',
    height: 200,
    backgroundColor: '#2E5BBA',
  },

  // Modal

  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 11,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
  },
  modalSubtitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  dismissArea: {
    flex: 1,
  },
  appointmentCardExpanded: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    height: 400,
    backgroundColor: '#2E5BBA',
  },
  appointmentInfoExpanded: {
    borderRadius: 20,
    padding: 20,
    width: '98%',
    height: '75%',
    marginLeft: '2%',
    backgroundColor: '#3769d6ff',
  },
})