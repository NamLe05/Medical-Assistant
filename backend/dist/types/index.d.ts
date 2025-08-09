export interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory?: string[];
    allergies?: string[];
    medications?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface MedicalRecord {
    recordId: string;
    userId: string;
    type: 'appointment' | 'test_result' | 'prescription' | 'symptom' | 'vaccination' | 'surgery';
    title: string;
    description: string;
    date: string;
    doctor?: string;
    hospital?: string;
    attachments?: string[];
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface Conversation {
    conversationId: string;
    userId: string;
    messages: Message[];
    summary?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Message {
    messageId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    metadata?: {
        symptoms?: string[];
        urgency?: 'low' | 'medium' | 'high';
        suggestedActions?: string[];
    };
}
export interface Reminder {
    reminderId: string;
    userId: string;
    title: string;
    description: string;
    scheduledTime: string;
    type: 'medication' | 'appointment' | 'test' | 'general';
    status: 'pending' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}
export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory?: string[];
    allergies?: string[];
    medications?: string[];
}
export interface CreateMedicalRecordRequest {
    userId: string;
    type: 'appointment' | 'test_result' | 'prescription' | 'symptom' | 'vaccination' | 'surgery';
    title: string;
    description: string;
    date: string;
    doctor?: string;
    hospital?: string;
    attachments?: string[];
    tags?: string[];
}
export interface ChatRequest {
    userId: string;
    message: string;
    conversationId?: string;
    context?: {
        symptoms?: string[];
        currentMedications?: string[];
        recentAppointments?: string[];
    };
}
export interface ChatResponse {
    conversationId: string;
    message: string;
    suggestions?: string[];
    urgency?: 'low' | 'medium' | 'high';
    shouldSeeDoctor?: boolean;
}
//# sourceMappingURL=index.d.ts.map