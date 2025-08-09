"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const joi_1 = __importDefault(require("joi"));
const dynamodb_1 = require("../../utils/dynamodb");
const updateMedicalRecordSchema = joi_1.default.object({
    type: joi_1.default.string().valid('appointment', 'test_result', 'prescription', 'symptom', 'vaccination', 'surgery').optional(),
    title: joi_1.default.string().min(1).max(200).optional(),
    description: joi_1.default.string().min(1).max(2000).optional(),
    date: joi_1.default.string().isoDate().optional(),
    doctor: joi_1.default.string().optional(),
    hospital: joi_1.default.string().optional(),
    attachments: joi_1.default.array().items(joi_1.default.string()).optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
});
const handler = async (event) => {
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
                }),
            };
        }
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
                }),
            };
        }
        const existingRecord = await dynamodb_1.medicalRecordsService.get({ recordId });
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
                }),
            };
        }
        const updatedRecord = await dynamodb_1.medicalRecordsService.update({ recordId }, {
            ...value,
            updatedAt: new Date().toISOString(),
        });
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
            }),
        };
    }
    catch (error) {
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
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=updateMedicalRecord.js.map