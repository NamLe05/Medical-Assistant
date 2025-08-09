import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

// Initialize DynamoDB DocumentClient
const dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-west-2',
});

export class DynamoDBService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create<T extends Record<string, any>>(item: T): Promise<T> {
    const params = {
      TableName: this.tableName,
      Item: item,
    };

    await dynamoClient.put(params).promise();
    return item;
  }

  async get<T>(key: Record<string, any>): Promise<T | null> {
    const params = {
      TableName: this.tableName,
      Key: key,
    };

    const result = await dynamoClient.get(params).promise();
    return result.Item as T || null;
  }

  async update<T extends Record<string, any>>(
    key: Record<string, any>,
    updates: Partial<T>
  ): Promise<T | null> {
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

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
    return result.Attributes as T || null;
  }

  async delete(key: Record<string, any>): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: key,
    };

    await dynamoClient.delete(params).promise();
  }

  async query<T>(
    keyConditionExpression: string,
    expressionAttributeNames?: Record<string, string>,
    expressionAttributeValues?: Record<string, any>,
    indexName?: string
  ): Promise<T[]> {
    const params: DocumentClient.QueryInput = {
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
    return (result.Items || []) as T[];
  }

  async scan<T>(
    filterExpression?: string,
    expressionAttributeNames?: Record<string, string>,
    expressionAttributeValues?: Record<string, any>
  ): Promise<T[]> {
    const params: DocumentClient.ScanInput = {
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
    return (result.Items || []) as T[];
  }
}

// Export service instances for each table
export const usersService = new DynamoDBService(process.env.USERS_TABLE_NAME || 'Users-full');
export const medicalRecordsService = new DynamoDBService(process.env.TABLE_NAME || 'MedicalRecords-full');
export const conversationsService = new DynamoDBService(process.env.CONVERSATIONS_TABLE_NAME || 'Conversations-full');
export const remindersService = new DynamoDBService(process.env.TABLE_NAME || 'Reminders-full'); 