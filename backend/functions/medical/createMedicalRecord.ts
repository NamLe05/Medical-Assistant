import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { medicalRecordsService, usersService } from '../../utils/dynamodb';
import { MedicalRecord, CreateMedicalRecordRequest, ApiResponse } from '../../types';

const createMedicalRecordSchema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string().valid('appointment', 'test_result', 'prescription', 'symptom', 'vaccination', 'surgery').required(),
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(2000).required(),
  date: Joi.string().isoDate().required(),
  doctor: Joi.string().optional(),
  hospital: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body: CreateMedicalRecordRequest = event.body ? JSON.parse(event.body) : {};

    // Validate input
    const { error, value } = createMedicalRecordSchema.validate(body);
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

    // Verify user exists
    const user = await usersService.get({ userId: value.userId });
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

    // Create medical record
    const now = new Date().toISOString();
    const medicalRecord: MedicalRecord = {
      recordId: uuidv4(),
      userId: value.userId,
      type: value.type,
      title: value.title,
      description: value.description,
      date: value.date,
      doctor: value.doctor,
      hospital: value.hospital,
      attachments: value.attachments || [],
      tags: value.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    await medicalRecordsService.create(medicalRecord);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify({
        success: true,
        data: medicalRecord,
        message: 'Medical record created successfully',
      } as ApiResponse<MedicalRecord>),
    };
  } catch (error) {
    console.error('Error creating medical record:', error);
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