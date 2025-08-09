export declare class DynamoDBService {
    private tableName;
    constructor(tableName: string);
    create<T extends Record<string, any>>(item: T): Promise<T>;
    get<T>(key: Record<string, any>): Promise<T | null>;
    update<T extends Record<string, any>>(key: Record<string, any>, updates: Partial<T>): Promise<T | null>;
    delete(key: Record<string, any>): Promise<void>;
    query<T>(keyConditionExpression: string, expressionAttributeNames?: Record<string, string>, expressionAttributeValues?: Record<string, any>, indexName?: string): Promise<T[]>;
    scan<T>(filterExpression?: string, expressionAttributeNames?: Record<string, string>, expressionAttributeValues?: Record<string, any>): Promise<T[]>;
}
export declare const usersService: DynamoDBService;
export declare const medicalRecordsService: DynamoDBService;
export declare const conversationsService: DynamoDBService;
export declare const remindersService: DynamoDBService;
//# sourceMappingURL=dynamodb.d.ts.map