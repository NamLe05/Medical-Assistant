"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remindersService = exports.conversationsService = exports.medicalRecordsService = exports.usersService = exports.DynamoDBService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoClient = new aws_sdk_1.default.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || 'us-west-2',
});
class DynamoDBService {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async create(item) {
        const params = {
            TableName: this.tableName,
            Item: item,
        };
        await dynamoClient.put(params).promise();
        return item;
    }
    async get(key) {
        const params = {
            TableName: this.tableName,
            Key: key,
        };
        const result = await dynamoClient.get(params).promise();
        return result.Item || null;
    }
    async update(key, updates) {
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        Object.keys(updates).forEach((attr, index) => {
            const attrName = `#attr${index}`;
            const attrValue = `:val${index}`;
            updateExpression.push(`${attrName} = ${attrValue}`);
            expressionAttributeNames[attrName] = attr;
            expressionAttributeValues[attrValue] = updates[attr];
        });
        const params = {
            TableName: this.tableName,
            Key: key,
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };
        const result = await dynamoClient.update(params).promise();
        return result.Attributes || null;
    }
    async delete(key) {
        const params = {
            TableName: this.tableName,
            Key: key,
        };
        await dynamoClient.delete(params).promise();
    }
    async query(keyConditionExpression, expressionAttributeNames, expressionAttributeValues, indexName) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
        };
        if (expressionAttributeNames) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }
        if (expressionAttributeValues) {
            params.ExpressionAttributeValues = expressionAttributeValues;
        }
        if (indexName) {
            params.IndexName = indexName;
        }
        const result = await dynamoClient.query(params).promise();
        return (result.Items || []);
    }
    async scan(filterExpression, expressionAttributeNames, expressionAttributeValues) {
        const params = {
            TableName: this.tableName,
        };
        if (filterExpression) {
            params.FilterExpression = filterExpression;
        }
        if (expressionAttributeNames) {
            params.ExpressionAttributeNames = expressionAttributeNames;
        }
        if (expressionAttributeValues) {
            params.ExpressionAttributeValues = expressionAttributeValues;
        }
        const result = await dynamoClient.scan(params).promise();
        return (result.Items || []);
    }
}
exports.DynamoDBService = DynamoDBService;
exports.usersService = new DynamoDBService(process.env.USERS_TABLE_NAME || 'Users-dev');
exports.medicalRecordsService = new DynamoDBService(process.env.TABLE_NAME || 'MedicalRecords-dev');
exports.conversationsService = new DynamoDBService(process.env.CONVERSATIONS_TABLE_NAME || 'Conversations-dev');
exports.remindersService = new DynamoDBService(process.env.TABLE_NAME || 'Reminders-dev');
//# sourceMappingURL=dynamodb.js.map