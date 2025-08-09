import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from './globalStyles';

interface AppointmentCardProps {
    title: string;
    subtitle: string;
    date: string;
    time: string;
    location: string;
    phone: string;
    notes: string;
}

const ModalAppointmentCard: React.FC<AppointmentCardProps> = ({
    title,
    subtitle,
    date,
    time,
    location,
    phone,
    notes
}) => {
    return (
        <View
            style={[styles.appointmentCardExpanded, { backgroundColor: '#2E5BBA' }]}
        >
            <View style={[globalStyles.row, { marginBottom: 10 }]}>
                <Ionicons name="notifications-circle" marginRight={10} color="white" size={60} />
                <View style={globalStyles.column}>
                    <Text style={[globalStyles.headerText, styles.modalTitle]}>{title}</Text>
                    <Text style={[globalStyles.cardSubtitleText, styles.modalSubtitle]}>{subtitle}</Text>
                </View>
            </View>

            <View style={styles.appointmentInfoExpanded}>
                <View style={[globalStyles.row, { marginBottom: 20 }]}>
                    <Ionicons name="calendar-outline" size={28} marginRight={10} color="white" />
                    <Text style={[styles.modalSubtitle, { width: "85%" }]}>{date}</Text>
                </View>

                <View style={[globalStyles.row, { marginBottom: 20 }]}>
                    <Ionicons name="time-outline" size={28} marginRight={10} color="white" />
                    <Text style={[styles.modalSubtitle, { width: "85%" }]}>{time}</Text>
                </View>

                <View style={[globalStyles.row, { marginBottom: 20, width: "85%" }]}>
                    <Ionicons name="location-outline" size={28} marginRight={10} color="white" />
                    <Text style={[styles.modalSubtitle]}>{location}</Text>
                </View>

                <View style={[globalStyles.row, { marginBottom: 20 }]}>
                    <Ionicons name="call-outline" size={28} marginRight={10} color="white" />
                    <Text style={[styles.modalSubtitle, { width: "85%" }]}>{phone}</Text>
                </View>

                <View style={[globalStyles.row, { marginBottom: 20 }]}>
                    <Ionicons name="document-outline" size={28} marginRight={10} color="white" />
                    <Text style={[styles.modalSubtitle, { width: "85%", maxHeight: "80%" }]}>{notes}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    appointmentCardExpanded: {
        borderRadius: 20,
        padding: 20,
        width: '100%',
        height: 400,
    },
    appointmentInfoExpanded: {
        borderRadius: 20,
        padding: 20,
        width: '98%',
        height: '80%',
        marginLeft: '2%',
        backgroundColor: '#3769d6ff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    modalSubtitle: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
    },
});

export default ModalAppointmentCard;