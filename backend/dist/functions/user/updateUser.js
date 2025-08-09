"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const joi_1 = __importDefault(require("joi"));
const dynamodb_1 = require("../../utils/dynamodb");
const updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(1).max(50).optional(),
    lastName: joi_1.default.string().min(1).max(50).optional(),
    dateOfBirth: joi_1.default.string().isoDate().optional(),
    phoneNumber: joi_1.default.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    emergencyContact: joi_1.default.object({
        name: joi_1.default.string().required(),
        phone: joi_1.default.string().required(),
        relationship: joi_1.default.string().required(),
    }).optional(),
    medicalHistory: joi_1.default.array().items(joi_1.default.string()).optional(),
    allergies: joi_1.default.array().items(joi_1.default.string()).optional(),
    medications: joi_1.default.array().items(joi_1.default.string()).optional(),
});
const handler = async (event) => {
    try {
        const userId = event.pathParameters?.userId;
        const body = event.body ? JSON.parse(event.body) : {};
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
                }),
            };
        }
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
                }),
            };
        }
        const existingUser = await dynamodb_1.usersService.get({ userId });
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
                }),
            };
        }
        const updatedUser = await dynamodb_1.usersService.update({ userId }, {
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
                data: updatedUser,
                message: 'User updated successfully',
            }),
        };
    }
    catch (error) {
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
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=updateUser.js.map