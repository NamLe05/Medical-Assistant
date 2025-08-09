import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { conversationsService, usersService } from '../../utils/dynamodb';
import { ChatRequest, ChatResponse, Conversation, Message, User, ApiResponse } from '../../types';

// Initialize OpenAI client
const openai = new (OpenAI as any)({
  apiKey: process.env.OPENAI_API_KEY,
});

const MEDICAL_SYSTEM_PROMPT = `You are an AI medical assistant designed to help users with their health-related questions and concerns. Your role is to:

1. Provide general health information and education
2. Help users understand their symptoms
3. Suggest when to seek professional medical attention
4. Assist with medication reminders and health tracking
5. Answer questions about medical procedures and conditions

IMPORTANT GUIDELINES:
- Always emphasize that you are not a replacement for professional medical advice
- If symptoms are severe or life-threatening, immediately recommend seeking emergency medical care
- Be empathetic and supportive while maintaining medical accuracy
- Ask clarifying questions when needed to better understand the user's situation
- Provide evidence-based information when possible
- Respect user privacy and maintain confidentiality

When responding, consider the user's medical history, current medications, and any context they provide.`;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: ChatRequest = event.body ? JSON.parse(event.body) : {};

    if (!body.userId || !body.message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({
          success: false,
          message: 'User ID and message are required',
        } as ApiResponse),
      };
    }

    // Get user information for context
    const user = await usersService.get<User>({ userId: body.userId });
    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({
          success: false,
          message: 'User not found',
        } as ApiResponse),
      };
    }

    let conversation: Conversation;
    const now = new Date().toISOString();

    if (body.conversationId) {
      // Continue existing conversation
      conversation = await conversationsService.get<Conversation>({ 
        conversationId: body.conversationId 
      }) || {
        conversationId: body.conversationId,
        userId: body.userId,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
    } else {
      // Start new conversation
      conversation = {
        conversationId: uuidv4(),
        userId: body.userId,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
    }

    // Add user message
    const userMessage: Message = {
      messageId: uuidv4(),
      role: 'user',
      content: body.message,
      timestamp: now,
    };

    conversation.messages.push(userMessage);

    // Prepare context for AI
    const userContext = `
User Information:
- Name: ${user.firstName} ${user.lastName}
- Age: ${user.dateOfBirth ? calculateAge(user.dateOfBirth) : 'Not specified'}
- Medical History: ${user.medicalHistory?.join(', ') || 'None specified'}
- Allergies: ${user.allergies?.join(', ') || 'None specified'}
- Current Medications: ${user.medications?.join(', ') || 'None specified'}
- Emergency Contact: ${user.emergencyContact ? `${user.emergencyContact.name} (${user.emergencyContact.relationship})` : 'Not specified'}
`;

    // Prepare conversation history
    const conversationHistory = conversation.messages
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: MEDICAL_SYSTEM_PROMPT + '\n\n' + userContext },
        { role: 'user', content: `Conversation History:\n${conversationHistory}\n\nCurrent Message: ${body.message}` }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I am unable to provide a response at this time.';

    // Add AI message
    const aiMessage: Message = {
      messageId: uuidv4(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        urgency: determineUrgency(body.message, aiResponse),
        suggestedActions: extractSuggestedActions(aiResponse),
      },
    };

    conversation.messages.push(aiMessage);
    conversation.updatedAt = new Date().toISOString();

    // Save conversation
    await conversationsService.create(conversation);

    const response: ChatResponse = {
      conversationId: conversation.conversationId,
      message: aiResponse,
      suggestions: aiMessage.metadata?.suggestedActions,
      urgency: aiMessage.metadata?.urgency,
      shouldSeeDoctor: aiMessage.metadata?.urgency === 'high',
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        success: true,
        data: response,
      } as ApiResponse<ChatResponse>),
    };
  } catch (error) {
    console.error('Error in AI chat:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse),
    };
  }
};

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function determineUrgency(userMessage: string, aiResponse: string): 'low' | 'medium' | 'high' {
  const urgentKeywords = [
    'emergency', 'severe', 'chest pain', 'difficulty breathing', 'unconscious',
    'bleeding', 'broken', 'fracture', 'heart attack', 'stroke', 'immediate',
    'call 911', 'ambulance', 'urgent care', 'emergency room'
  ];

  const mediumKeywords = [
    'pain', 'fever', 'infection', 'swelling', 'rash', 'dizziness',
    'nausea', 'vomiting', 'diarrhea', 'headache', 'consult doctor'
  ];

  const combinedText = (userMessage + ' ' + aiResponse).toLowerCase();
  
  if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'high';
  } else if (mediumKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
}

function extractSuggestedActions(aiResponse: string): string[] {
  const suggestions: string[] = [];
  
  // Extract common medical suggestions
  if (aiResponse.toLowerCase().includes('see a doctor')) {
    suggestions.push('Schedule an appointment with your doctor');
  }
  if (aiResponse.toLowerCase().includes('emergency')) {
    suggestions.push('Seek immediate medical attention');
  }
  if (aiResponse.toLowerCase().includes('rest')) {
    suggestions.push('Get adequate rest');
  }
  if (aiResponse.toLowerCase().includes('hydration')) {
    suggestions.push('Stay hydrated');
  }
  
  return suggestions;
} 