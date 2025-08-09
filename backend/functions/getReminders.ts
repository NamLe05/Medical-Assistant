import { APIGatewayProxyHandler } from 'aws-lambda';
import { remindersService } from '../utils/dynamodb';
import { Reminder, ApiResponse } from '../types';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.pathParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET',
        },
        body: JSON.stringify({
          success: false,
          message: 'User ID is required',
        } as ApiResponse),
      };
    }

    // Get reminders for the user
    const reminders = await remindersService.query<Reminder>(
      '#userId = :userId',
      { '#userId': 'userId' },
      { ':userId': userId }
    );

    // Sort by scheduled time
    const sortedReminders = reminders.sort((a, b) => 
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        success: true,
        data: sortedReminders,
      } as ApiResponse<Reminder[]>),
    };
  } catch (error) {
    console.error('Error getting reminders:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse),
    };
  }
}; 