import { useCallback, useState } from "react";

export interface Appointment {
    id: string | number;
    title: string;
    subtitle: string; // Hospital/clinic name
    date: string;
    time: string;
    location: string;
    phone: string;
    notes: string;
}

// For multiple appointments
export type AppointmentList = Appointment[];

// For API responses
export interface AppointmentResponse {
    appointments: Appointment[];
    total: number;
    hasMore: boolean;
}


// useAppointments.ts
export const useAppointments = (initialAppointments: AppointmentList = []) => {
    const [appointments, setAppointments] = useState<AppointmentList>(initialAppointments);

    const addAppt = useCallback((appointment: Appointment) => {
        setAppointments(prev => [...prev, appointment]);
    }, []);

    const removeAppt = useCallback((id: string | number) => {
        setAppointments(prev => prev.filter(appt => appt.id !== id));
    }, []);

    const updateAppt = useCallback((id: string | number, updates: Partial<Appointment>) => {
        setAppointments(prev =>
            prev.map(appt => appt.id === id ? { ...appt, ...updates } : appt)
        );
    }, []);

    return { appointments, addAppt, removeAppt, updateAppt };
};
