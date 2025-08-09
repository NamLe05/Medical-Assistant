import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { usersService } from '../../utils/dynamodb';
import { User, CreateUserRequest, ApiResponse } from '../../types';

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  dateOfBirth: Joi.string().isoDate().optional(),
  phoneNumber: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    relationship: Joi.string().required(),
  }).optional(),
});

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Parse request body
    const body: CreateUserRequest = event.body ? JSON.parse(event.body) : {};

    // Validate input
    const { error, value } = createUserSchema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({
          success: false,
          message: 'Validation error',
          error: error.details[0].message,
        } as ApiResponse),
      };
    }

    // Check if user already exists
    const existingUser = await usersService.query<User>(
      '#email = :email',
      { '#email': 'email' },
      { ':email': value.email },
      'EmailIndex'
    );

    if (existingUser.length > 0) {
      return {
        statusCode: 409,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST',
        },
        body: JSON.stringify({
          success: false,
          message: 'User with this email already exists',
        } as ApiResponse),
      };
    }

    // Create new user
    const now = new Date().toISOString();
    const newUser: User = {
      userId: uuidv4(),
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      dateOfBirth: value.dateOfBirth,
      phoneNumber: value.phoneNumber,
      emergencyContact: value.emergencyContact,
      medicalHistory: [],
      allergies: [],
      medications: [],
      createdAt: now,
      updatedAt: now,
    };

    await usersService.create(newUser);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        success: true,
        data: newUser,
        message: 'User created successfully',
      } as ApiResponse<User>),
    };
  } catch (error) {
    console.error('Error creating user:', error);
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