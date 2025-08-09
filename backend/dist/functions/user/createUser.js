"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
const dynamodb_1 = require("../../utils/dynamodb");
const createUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().min(1).max(50).required(),
    lastName: joi_1.default.string().min(1).max(50).required(),
    dateOfBirth: joi_1.default.string().isoDate().optional(),
    phoneNumber: joi_1.default.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    emergencyContact: joi_1.default.object({
        name: joi_1.default.string().required(),
        phone: joi_1.default.string().required(),
        relationship: joi_1.default.string().required(),
    }).optional(),
});
const handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
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
                }),
            };
        }
        const existingUser = await dynamodb_1.usersService.query('#email = :email', { '#email': 'email' }, { ':email': value.email }, 'EmailIndex');
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
                }),
            };
        }
        const now = new Date().toISOString();
        const newUser = {
            userId: (0, uuid_1.v4)(),
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
        await dynamodb_1.usersService.create(newUser);
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
            }),
        };
    }
    catch (error) {
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
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=createUser.js.map