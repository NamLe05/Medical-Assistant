"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    try {
        console.log('Test function executed successfully');
        console.log('Event:', JSON.stringify(event, null, 2));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET',
            },
            body: JSON.stringify({
                success: true,
                message: 'Test function working!',
                timestamp: new Date().toISOString(),
                event: event
            }),
        };
    }
    catch (error) {
        console.error('Error in test function:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET',
            },
            body: JSON.stringify({
                success: false,
                message: 'Test function error',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=test.js.map