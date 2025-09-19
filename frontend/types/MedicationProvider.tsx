import React, { createContext, useContext, useCallback, useState, ReactNode } from "react";

export interface Medication {
    id: string;
    name: string;
    color: string;
    type: 'medication' | 'supplement';
    notes: string;

    dosage: string; // '10mg'
    frequencyAmount: number; // '2 pills'
    frequencyTimes: number; // ' twice daily'
    remaining: number;
    total: number;

    timeTaken?: string;
    timesToTake: string[];
    taken: boolean;
}

export type MedicationList = Medication[];

interface MedicationsContextType {
    medications: MedicationList;
    addMedication: (medication: Medication) => void;
    removeMedication: (id: string) => void;
    updateMedication: (id: string, updates: Partial<Medication>) => void;
    getTaken: (medication: Medication) => boolean;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

interface MedicationsProviderProps {
    children: ReactNode;
    initialMedications?: MedicationList;
}

// Private helper functions
const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
};

const getNextTimeToTake = (medication: Medication): { nextTime: Date | null, isToday: boolean } => {
    if (medication.timesToTake.length === 0) {
        return { nextTime: null, isToday: false };
    }

    const now = new Date();
    const today = new Date(now);

    const todayTimes = medication.timesToTake.map(timeStr => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date(today);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }).sort((a, b) => a.getTime() - b.getTime());

    const lastTaken = medication.timeTaken ? new Date(medication.timeTaken) : null;
    const isTakenToday = lastTaken && isSameDay(lastTaken, now);

    for (let i = 0; i < todayTimes.length; i++) {
        const doseTime = todayTimes[i];

        if (doseTime > now) {
            if (!isTakenToday) {
                return { nextTime: doseTime, isToday: true };
            }

            if (lastTaken && lastTaken < doseTime) {
                return { nextTime: doseTime, isToday: true };
            }
        }
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = medication.timesToTake[0].split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);

    return { nextTime: tomorrow, isToday: false };
};

const sortMedications = (medications: Medication[]): Medication[] => {
    return medications.sort((a, b) => {
        const nextA = getNextTimeToTake(a);
        const nextB = getNextTimeToTake(b);

        if (!nextA.nextTime && !nextB.nextTime) return 0;
        if (!nextA.nextTime) return 1;
        if (!nextB.nextTime) return -1;

        return nextA.nextTime.getTime() - nextB.nextTime.getTime();
    });
};

export const MedicationsProvider = ({ children, initialMedications = [] }: MedicationsProviderProps) => {
    const [medications, setMedications] = useState<MedicationList>(
        sortMedications(initialMedications)
    );

    const getTaken = useCallback((medication: Medication): boolean => {
        const { nextTime, isToday } = getNextTimeToTake(medication);

        if (!nextTime) return false;

        const now = new Date();

        if (isToday && nextTime > now) {
            return true;
        }

        if (!isToday) {
            return true;
        }

        return false;
    }, []);

    const addMedication = useCallback((medication: Medication) => {
        console.log('Adding medication to context:', medication);
        setMedications(prev => {
            const newMedications = sortMedications([...prev, medication]);
            console.log('New medications list (sorted):', newMedications);
            return newMedications;
        });
    }, []);

    const removeMedication = useCallback((id: string | number) => {
        setMedications(prev => {
            const filtered = prev.filter(med => med.id !== id);
            return sortMedications(filtered);
        });
    }, []);

    const updateMedication = useCallback((id: string | number, updates: Partial<Medication>) => {
        setMedications(prev => {
            const updated = prev.map(med => med.id === id ? { ...med, ...updates } : med);
            return sortMedications(updated);
        });
    }, []);

    const value: MedicationsContextType = {
        medications,
        addMedication,
        removeMedication,
        updateMedication,
        getTaken,
    };

    return (
        <MedicationsContext.Provider value={value}>
            {children}
        </MedicationsContext.Provider>
    );
};

// Custom hook to use the context
export const useMedications = () => {
    const context = useContext(MedicationsContext);
    if (context === undefined) {
        throw new Error('useMedications must be used within a MedicationsProvider');
    }
    return context;
};