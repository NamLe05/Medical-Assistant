import { APIGatewayProxyHandler } from 'aws-lambda';
import { medicalRecordsService } from '../../utils/dynamodb';
import { MedicalRecord, ApiResponse } from '../../types';

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

    // Get medical records for the user
    const medicalRecords = await medicalRecordsService.query<MedicalRecord>(
      '#userId = :userId',
      { '#userId': 'userId' },
      { ':userId': userId },
      'UserRecordsIndex'
    );

    // Sort by date (newest first)
    const sortedRecords = medicalRecords.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
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
        data: sortedRecords,
      } as ApiResponse<MedicalRecord[]>),
    };
  } catch (error) {
    console.error('Error getting medical records:', error);
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