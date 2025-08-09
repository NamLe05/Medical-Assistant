import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../components/globalStyles';
import { Appointment } from '../types/AppointmentType';

interface AppointmentCardProps {
    appointment: Appointment | null;
    totalAppointments: number;
    onPress: (appointment: Appointment | null) => void; // Updated to accept null
}

export default function AppointmentCardStack({ appointment, totalAppointments, onPress }: AppointmentCardProps) {
    // EMPTY CARD - when appointment is null
    if (appointment === null) {
        return (
            <View style={styles.cardStack}>
                <TouchableOpacity
                    style={[styles.emptyAppointmentCard, globalStyles.columnCentered]}
                    activeOpacity={0.7}
                    onPress={() => onPress(null)}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="add" size={48} color="black" />
                        <Text style={[globalStyles.cardTitleText, { marginTop: 10, color: '#333' }]}>Add New</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // APPOINTMENT CARD - when appointment exists
    return (
        <View style={styles.cardStack}>
            {totalAppointments >= 2 && <View style={styles.cardShadowLayer}></View>}
            {totalAppointments >= 3 && <View style={styles.cardShadowLayer2}></View>}
            <TouchableOpacity
                style={styles.appointmentCard}
                activeOpacity={1}
                onPress={() => onPress(appointment)}
            >
                <View style={globalStyles.row}>
                    <Ionicons name="notifications-circle" marginRight={10} color="white" size={60} />
                    <View style={globalStyles.column}>
                        <Text style={globalStyles.cardTitleText}>{appointment.title}</Text>
                        <Text style={globalStyles.cardSubtitleText}>{appointment.subtitle}</Text>
                    </View>
                </View>

                <View style={styles.appointmentDateContainer}>
                    <Ionicons name="calendar-outline" size={24} color="white" />
                    <Text style={globalStyles.cardSubtitleText}>{appointment.date}</Text>
                    <View style={styles.appointmentDateDivider}></View>
                    <Ionicons name="time-outline" size={24} color="white" />
                    <Text style={globalStyles.cardSubtitleText}>{appointment.time}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cardStack: {
        position: 'relative',
        width: '100%',
        height: 160,
    },
    cardShadowLayer: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        backgroundColor: '#5e87ddff',
        width: '96%',
        zIndex: 1,
    },
    cardShadowLayer2: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 0,
        bottom: -8,
        borderRadius: 26,
        width: '92%',
        backgroundColor: 'rgba(116, 139, 185, 0.4)',
        zIndex: 0,
    },
    appointmentCard: {
        borderRadius: 20,
        padding: 10,
        width: '100%',
        height: 150,
        backgroundColor: '#2E5BBA',
        zIndex: 2,
    },
    emptyAppointmentCard: {
        borderRadius: 20,
        padding: 10,
        width: '100%',
        height: 150,
        backgroundColor: '#ffffff',
        borderWidth: 2,
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
});