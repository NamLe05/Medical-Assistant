import { APIGatewayProxyHandler } from 'aws-lambda';
import { usersService } from '../../utils/dynamodb';
import { User, ApiResponse } from '../../types';

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

    const user = await usersService.get<User>({ userId });

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET',
        },
        body: JSON.stringify({
          success: false,
          message: 'User not found',
        } as ApiResponse),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        success: true,
        data: user,
      } as ApiResponse<User>),
    };
  } catch (error) {
    console.error('Error getting user:', error);
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