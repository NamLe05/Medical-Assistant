import { APIGatewayProxyHandler } from 'aws-lambda';
import Joi from 'joi';
import { medicalRecordsService } from '../../utils/dynamodb';
import { MedicalRecord, ApiResponse } from '../../types';

const updateMedicalRecordSchema = Joi.object({
  type: Joi.string().valid('appointment', 'test_result', 'prescription', 'symptom', 'vaccination', 'surgery').optional(),
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().min(1).max(2000).optional(),
  date: Joi.string().isoDate().optional(),
  doctor: Joi.string().optional(),
  hospital: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const recordId = event.pathParameters?.recordId;
    const body = event.body ? JSON.parse(event.body) : {};

    if (!recordId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT',
        },
        body: JSON.stringify({
          success: false,
          message: 'Record ID is required',
        } as ApiResponse),
      };
    }

    // Validate input
    const { error, value } = updateMedicalRecordSchema.validate(body);
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

    // Check if record exists
    const existingRecord = await medicalRecordsService.get<MedicalRecord>({ recordId });
    if (!existingRecord) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT',
        },
        body: JSON.stringify({
          success: false,
          message: 'Medical record not found',
        } as ApiResponse),
      };
    }

    // Update record
    const updatedRecord = await medicalRecordsService.update<MedicalRecord>(
      { recordId },
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
        data: updatedRecord,
        message: 'Medical record updated successfully',
      } as ApiResponse<MedicalRecord>),
    };
  } catch (error) {
    console.error('Error updating medical record:', error);
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