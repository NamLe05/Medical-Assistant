import { APIGatewayProxyHandler } from 'aws-lambda';
import Joi from 'joi';
import { usersService } from '../../utils/dynamodb';
import { User, UpdateUserRequest, ApiResponse } from '../../types';

const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  dateOfBirth: Joi.string().isoDate().optional(),
  phoneNumber: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    relationship: Joi.string().required(),
  }).optional(),
  medicalHistory: Joi.array().items(Joi.string()).optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medications: Joi.array().items(Joi.string()).optional(),
});

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    const body: UpdateUserRequest = event.body ? JSON.parse(event.body) : {};

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT',
        },
        body: JSON.stringify({
          success: false,
          message: 'User ID is required',
        } as ApiResponse),
      };
    }

    // Validate input
    const { error, value } = updateUserSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT',
        },
        body: JSON.stringify({
          success: false,
          message: 'Validation error',
          error: error.details[0].message,
        } as ApiResponse),
      };
    }

    // Check if user exists
    const existingUser = await usersService.get<User>({ userId });
    if (!existingUser) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT',
        },
        body: JSON.stringify({
          success: false,
          message: 'User not found',
        } as ApiResponse),
      };
    }

    // Update user
    const updatedUser = await usersService.update<User>(
      { userId },
      {
        ...value,
        updatedAt: new Date().toISOString(),
      }
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT',
      },
      body: JSON.stringify({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      } as ApiResponse<User>),
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT',
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse),
    };
  }
}; 