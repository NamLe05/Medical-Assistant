# AWS Setup Guide for Medical Assistant Backend

This guide will help you configure AWS CLI and deploy the AI Medical Assistant backend using AWS Lambda and DynamoDB.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **AWS Account** with appropriate permissions
3. **Serverless Framework** (will be installed via npm)

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure AWS CLI

### 2.1 Install AWS CLI

Download and install AWS CLI from: https://aws.amazon.com/cli/

### 2.2 Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Your AWS access key
- **AWS Secret Access Key**: Your AWS secret key
- **Default region name**: `us-west-2` (or your preferred region)
- **Default output format**: `json`

### 2.3 Create IAM User (if needed)

If you don't have an IAM user with appropriate permissions:

1. Go to AWS IAM Console
2. Create a new user
3. Attach the following policies:
   - `AWSLambdaFullAccess`
   - `AmazonDynamoDBFullAccess`
   - `CloudFormationFullAccess`
   - `IAMFullAccess` (for creating execution roles)

## Step 3: Set Environment Variables

Create a `.env` file in the backend directory:

```bash
# OpenAI API Key (for AI chat functionality)
OPENAI_API_KEY=your_openai_api_key_here

# AWS Configuration
AWS_REGION=us-west-2
AWS_PROFILE=default

# Optional: Custom stage name
STAGE=dev
```

## Step 4: Configure Serverless Framework

### 4.1 Install Serverless Framework Globally (optional)

```bash
npm install -g serverless
```

### 4.2 Verify Configuration

Check your `serverless.yml` file is properly configured. The main configurations are:

- **Service name**: `ai-medical-assistant-backend`
- **Runtime**: `nodejs18.x`
- **Region**: `us-west-2`
- **Stage**: `dev` (configurable)

## Step 5: Deploy the Backend

### 5.1 Deploy to Development

```bash
npm run deploy
```

Or with custom stage:

```bash
serverless deploy --stage dev
```

### 5.2 Deploy to Production

```bash
npm run deploy:prod
```

Or:

```bash
serverless deploy --stage prod
```

## Step 6: Verify Deployment

### 6.1 Check AWS Resources

After deployment, verify these resources were created:

1. **Lambda Functions**:
   - `ai-medical-assistant-backend-dev-createUser`
   - `ai-medical-assistant-backend-dev-getUser`
   - `ai-medical-assistant-backend-dev-createMedicalRecord`
   - `ai-medical-assistant-backend-dev-chatWithAI`
   - `ai-medical-assistant-backend-dev-saveReminder`
   - `ai-medical-assistant-backend-dev-getReminders`

2. **DynamoDB Tables**:
   - `Users-dev`
   - `MedicalRecords-dev`
   - `Conversations-dev`
   - `Reminders-dev`

3. **API Gateway**: REST API with endpoints

### 6.2 Test Endpoints

You can test the endpoints using the provided URLs in the deployment output.

## Step 7: Local Development

### 7.1 Run Locally

```bash
npm run dev
```

This will start the serverless offline server for local development.

### 7.2 Test Local Endpoints

The local server will be available at `http://localhost:3000`

## Step 8: Monitoring and Logs

### 8.1 View Lambda Logs

```bash
serverless logs -f functionName -t
```

### 8.2 Monitor DynamoDB

- Go to AWS DynamoDB Console
- Check table metrics and performance

### 8.3 CloudWatch Monitoring

- Set up CloudWatch alarms for Lambda errors
- Monitor API Gateway metrics

## Troubleshooting

### Common Issues

1. **Permission Denied**:
   - Ensure your IAM user has the required permissions
   - Check AWS credentials are properly configured

2. **Deployment Fails**:
   - Check CloudFormation logs in AWS Console
   - Verify all environment variables are set

3. **Lambda Timeout**:
   - Increase timeout in `serverless.yml` if needed
   - Optimize function code

4. **DynamoDB Connection Issues**:
   - Verify table names match environment variables
   - Check IAM roles have proper DynamoDB permissions

### Useful Commands

```bash
# Remove deployment
serverless remove

# Deploy specific function
serverless deploy function -f functionName

# View deployment info
serverless info

# Check serverless version
serverless --version
```

## Security Considerations

1. **API Keys**: Store sensitive keys in AWS Systems Manager Parameter Store
2. **CORS**: Configure CORS properly for production
3. **IAM Roles**: Use least privilege principle
4. **Encryption**: Enable DynamoDB encryption at rest
5. **VPC**: Consider using VPC for additional security

## Cost Optimization

1. **DynamoDB**: Use on-demand billing for development
2. **Lambda**: Monitor function execution times
3. **API Gateway**: Consider caching for frequently accessed data
4. **CloudWatch**: Set up billing alerts

## Next Steps

1. Configure your frontend to use the deployed API endpoints
2. Set up CI/CD pipeline for automated deployments
3. Implement authentication and authorization
4. Add monitoring and alerting
5. Set up backup and disaster recovery procedures 