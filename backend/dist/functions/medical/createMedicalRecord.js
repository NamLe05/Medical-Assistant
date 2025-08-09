"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const dynamodb_1 = require("../../utils/dynamodb");
const createMedicalRecordSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    type: joi_1.default.string().valid('appointment', 'test_result', 'prescription', 'symptom', 'vaccination', 'surgery').required(),
    title: joi_1.default.string().min(1).max(200).required(),
    description: joi_1.default.string().min(1).max(2000).required(),
    date: joi_1.default.string().isoDate().required(),
    doctor: joi_1.default.string().optional(),
    hospital: joi_1.default.string().optional(),
    attachments: joi_1.default.array().items(joi_1.default.string()).optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
});
const handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
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
                }),
            };
        }
        const user = await dynamodb_1.usersService.get({ userId: value.userId });
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
                }),
            };
        }
        const now = new Date().toISOString();
        const medicalRecord = {
            recordId: (0, uuid_1.v4)(),
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
        await dynamodb_1.medicalRecordsService.create(medicalRecord);
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
            }),
        };
    }
    catch (error) {
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
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=createMedicalRecord.js.map