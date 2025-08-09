"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dynamodb_1 = require("../../utils/dynamodb");
const handler = async (event) => {
    try {
        const recordId = event.pathParameters?.recordId;
        if (!recordId) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'DELETE',
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Record ID is required',
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
                    'Access-Control-Allow-Methods': 'DELETE',
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Medical record not found',
                }),
            };
        }
        await dynamodb_1.medicalRecordsService.delete({ recordId });
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'DELETE',
            },
            body: JSON.stringify({
                success: true,
                message: 'Medical record deleted successfully',
            }),
        };
    }
    catch (error) {
        console.error('Error deleting medical record:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'DELETE',
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
//# sourceMappingURL=deleteMedicalRecord.js.map