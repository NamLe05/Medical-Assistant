# AI Medical Assistant

This is a boilerplate project for an AI medical assistant app with:

- Frontend: React Native (Expo SDK 50)
- Backend: AWS Lambda + DynamoDB (Serverless Framework)

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
sls deploy --stage dev
```

You need AWS CLI configured for deployment.