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
    colors: { primary: string; secondary: string };
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

const sortAppointments = (appointments: Appointment[]): Appointment[] => {
    return appointments.sort((a, b) => {
        // Parse dates (assuming they're stored as ISO strings now)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // First sort by date
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }

        // If dates are the same, sort by start time
        const getStartTime = (timeString: string): number => {
            const [startTime] = timeString.split(' - ');
            const [hours, minutes] = startTime.split(':').map(Number);
            return hours * 60 + minutes; // Convert to minutes for easy comparison
        };

        return getStartTime(a.time) - getStartTime(b.time);
    });
};


export const AppointmentsProvider = ({ children, initialAppointments = [] }: AppointmentsProviderProps) => {
    const [appointments, setAppointments] = useState<AppointmentList>(
        sortAppointments(initialAppointments)
    );

    const addAppt = useCallback((appointment: Appointment) => {
        console.log('Adding appointment to context:', appointment);
        setAppointments(prev => {
            const newAppointments = sortAppointments([...prev, appointment]);
            console.log('New appointments list (sorted):', newAppointments);
            return newAppointments;
        });
    }, []);

    const removeAppt = useCallback((id: string | number) => {
        setAppointments(prev => {
            const filtered = prev.filter(appt => appt.id !== id);
            return sortAppointments(filtered);
        });
    }, []);

    const updateAppt = useCallback((id: string | number, updates: Partial<Appointment>) => {
        setAppointments(prev => {
            const updated = prev.map(appt => appt.id === id ? { ...appt, ...updates } : appt);
            return sortAppointments(updated);
        });
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

export const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
};