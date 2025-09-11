import React, { createContext, useContext, useCallback, useState, ReactNode } from "react";

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

// Context type
interface AppointmentsContextType {
    appointments: AppointmentList;
    addAppt: (appointment: Appointment) => void;
    removeAppt: (id: string | number) => void;
    updateAppt: (id: string | number, updates: Partial<Appointment>) => void;
}

// Create the context
const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Provider component
interface AppointmentsProviderProps {
    children: ReactNode;
    initialAppointments?: AppointmentList;
}

export const AppointmentsProvider = ({ children, initialAppointments = [] }: AppointmentsProviderProps) => {
    const [appointments, setAppointments] = useState<AppointmentList>(initialAppointments);

    const addAppt = useCallback((appointment: Appointment) => {
        console.log('Adding appointment to context:', appointment);
        setAppointments(prev => {
            const newAppointments = [...prev, appointment];
            console.log('New appointments list:', newAppointments);
            return newAppointments;
        });
    }, []);

    const removeAppt = useCallback((id: string | number) => {
        setAppointments(prev => prev.filter(appt => appt.id !== id));
    }, []);

    const updateAppt = useCallback((id: string | number, updates: Partial<Appointment>) => {
        setAppointments(prev =>
            prev.map(appt => appt.id === id ? { ...appt, ...updates } : appt)
        );
    }, []);

    const value: AppointmentsContextType = {
        appointments,
        addAppt,
        removeAppt,
        updateAppt
    };

    return (
        <AppointmentsContext.Provider value={value}>
            {children}
        </AppointmentsContext.Provider>
    );
};

// Custom hook to use the context
export const useAppointments = () => {
    const context = useContext(AppointmentsContext);
    if (context === undefined) {
        throw new Error('useAppointments must be used within an AppointmentsProvider');
    }
    return context;
};