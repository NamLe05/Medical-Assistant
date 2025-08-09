"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dynamodb_1 = require("../../utils/dynamodb");
const handler = async (event) => {
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
                }),
            };
        }
        const medicalRecords = await dynamodb_1.medicalRecordsService.query('#userId = :userId', { '#userId': 'userId' }, { ':userId': userId }, 'UserRecordsIndex');
        const sortedRecords = medicalRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET',
            },
            body: JSON.stringify({
                success: true,
                data: sortedRecords,
            }),
        };
    }
    catch (error) {
        console.error('Error getting medical records:', error);
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
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=getMedicalRecords.js.map