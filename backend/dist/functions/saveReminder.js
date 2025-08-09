"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        if (!body.userId || !body.time || !body.note) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields" }),
            };
        }
        await dynamo.put({
            TableName: process.env.TABLE_NAME || "Reminders-dev",
            Item: {
                userId: body.userId,
                time: body.time,
                note: body.note,
            },
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=saveReminder.js.map