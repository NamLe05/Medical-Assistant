import { APIGatewayProxyHandler } from 'aws-lambda';
import { medicalRecordsService } from '../../utils/dynamodb';
import { ApiResponse } from '../../types';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const recordId = event.pathParameters?.recordId;

    if (!recordId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE',
        },
        body: JSON.stringify({
          success: false,
          message: 'Record ID is required',
        } as ApiResponse),
      };
    }

    // Check if record exists
    const existingRecord = await medicalRecordsService.get({ recordId });
    if (!existingRecord) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE',
        },
        body: JSON.stringify({
          success: false,
          message: 'Medical record not found',
        } as ApiResponse),
      };
    }

    // Delete record
    await medicalRecordsService.delete({ recordId });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE',
      },
      body: JSON.stringify({
        success: true,
        message: 'Medical record deleted successfully',
      } as ApiResponse),
    };
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE',
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse),
    };
  }
}; 