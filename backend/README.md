# AI Medical Assistant Backend

A serverless backend for the AI Medical Assistant application built with AWS Lambda, DynamoDB, and the Serverless Framework.

## Features

- **User Management**: Create, read, and update user profiles with medical information
- **Medical Records**: Store and manage medical records, appointments, and test results
- **AI Chat**: Intelligent medical assistant powered by OpenAI GPT-4
- **Reminders**: Medication and appointment reminder system
- **Conversation History**: Track and manage AI chat conversations
- **Serverless Architecture**: Scalable and cost-effective AWS Lambda functions

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│   Lambda        │───▶│   DynamoDB      │
│                 │    │   Functions     │    │   Tables        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   OpenAI API    │
                       │   (GPT-4)       │
                       └─────────────────┘
```

## API Endpoints

### User Management
- `POST /users` - Create a new user
- `GET /users/{userId}` - Get user information
- `PUT /users/{userId}` - Update user information

### Medical Records
- `POST /medical-records` - Create a medical record
- `GET /medical-records/{userId}` - Get user's medical records
- `PUT /medical-records/{recordId}` - Update a medical record
- `DELETE /medical-records/{recordId}` - Delete a medical record

### AI Chat
- `POST /chat` - Chat with AI medical assistant

### Reminders
- `POST /save-reminder` - Create a reminder
- `GET /reminders/{userId}` - Get user's reminders

## Database Schema

### Users Table
- `userId` (String, Primary Key)
- `email` (String, GSI)
- `firstName` (String)
- `lastName` (String)
- `dateOfBirth` (String)
- `phoneNumber` (String)
- `emergencyContact` (Object)
- `medicalHistory` (Array)
- `allergies` (Array)
- `medications` (Array)
- `createdAt` (String)
- `updatedAt` (String)

### Medical Records Table
- `recordId` (String, Primary Key)
- `userId` (String, GSI)
- `type` (String: appointment, test_result, prescription, symptom, vaccination, surgery)
- `title` (String)
- `description` (String)
- `date` (String)
- `doctor` (String)
- `hospital` (String)
- `attachments` (Array)
- `tags` (Array)
- `createdAt` (String)
- `updatedAt` (String)

### Conversations Table
- `conversationId` (String, Primary Key)
- `userId` (String, GSI)
- `messages` (Array)
- `summary` (String)
- `createdAt` (String)
- `updatedAt` (String)

### Reminders Table
- `userId` (String, Partition Key)
- `reminderId` (String, Sort Key)
- `title` (String)
- `description` (String)
- `scheduledTime` (String)
- `type` (String: medication, appointment, test, general)
- `status` (String: pending, completed, cancelled)
- `priority` (String: low, medium, high)
- `createdAt` (String)
- `updatedAt` (String)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure AWS CLI**
   ```bash
   aws configure
   ```

3. **Set Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your OpenAI API key and AWS configuration
   ```

4. **Deploy to AWS**
   ```bash
   npm run deploy
   ```

For detailed setup instructions, see [AWS_SETUP.md](./AWS_SETUP.md).

## Development

### Local Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy          # Deploy to dev stage
npm run deploy:prod     # Deploy to prod stage
```

### Testing
```bash
npm test
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI chat | Yes |
| `AWS_REGION` | AWS region for deployment | No (default: us-west-2) |
| `AWS_PROFILE` | AWS profile name | No (default: default) |
| `STAGE` | Deployment stage | No (default: dev) |

## Security

- All endpoints include CORS headers
- Input validation using Joi schemas
- AWS IAM roles with least privilege access
- DynamoDB encryption at rest
- API Gateway request validation

## Monitoring

- CloudWatch logs for all Lambda functions
- DynamoDB metrics and performance monitoring
- API Gateway request/response logging
- Error tracking and alerting

## Cost Optimization

- DynamoDB on-demand billing for development
- Lambda function optimization
- API Gateway caching for frequently accessed data
- CloudWatch billing alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 