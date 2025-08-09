# Medical Assistant API Documentation

## 🏥 Overview

The Medical Assistant API is a comprehensive backend service built with AWS Serverless architecture, providing healthcare management functionality including user profiles, medical records, AI-powered chat, and medication reminders.

## 🌐 Base URL

```
https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev
```

## 📋 Table of Contents

- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Testing with cURL](#testing-with-curl)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Examples](#examples)

## 🔐 Authentication

Currently, the API uses a simple user-based system. All endpoints require a valid `userId` for user-specific operations.

## 📡 API Endpoints

### 1. Test Endpoint

**GET** `/test`

Test the API connectivity.

**Response:**
```json
{
  "success": true,
  "message": "Test function working!",
  "timestamp": "2025-08-09T07:25:27.463Z"
}
```

---

### 2. User Management

#### Create User
**POST** `/users`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1234567890",
    "medicalHistory": [],
    "allergies": [],
    "medications": [],
    "createdAt": "2025-08-09T07:25:27.463Z",
    "updatedAt": "2025-08-09T07:25:27.463Z"
  },
  "message": "User created successfully"
}
```

#### Get User Profile
**GET** `/users/profile/{userId}`

Retrieve user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1234567890",
    "medicalHistory": [],
    "allergies": [],
    "medications": [],
    "createdAt": "2025-08-09T07:25:27.463Z",
    "updatedAt": "2025-08-09T07:25:27.463Z"
  }
}
```

#### Update User Profile
**PUT** `/users/profile/{userId}`

Update user profile information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1987654321"
}
```

---

### 3. Medical Records

#### Create Medical Record
**POST** `/medical-records`

Create a new medical record.

**Request Body:**
```json
{
  "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
  "title": "Annual Checkup",
  "description": "Routine annual physical examination",
  "date": "2025-08-09",
  "doctor": "Dr. Smith",
  "diagnosis": "Healthy",
  "treatment": "No treatment needed",
  "medications": ["None"],
  "notes": "Patient is in good health"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recordId": "med-12345678-1234-1234-1234-123456789012",
    "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
    "title": "Annual Checkup",
    "description": "Routine annual physical examination",
    "date": "2025-08-09",
    "doctor": "Dr. Smith",
    "diagnosis": "Healthy",
    "treatment": "No treatment needed",
    "medications": ["None"],
    "notes": "Patient is in good health",
    "createdAt": "2025-08-09T07:25:27.463Z",
    "updatedAt": "2025-08-09T07:25:27.463Z"
  },
  "message": "Medical record created successfully"
}
```

#### Get Medical Records
**GET** `/medical-records/user/{userId}`

Retrieve all medical records for a user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "recordId": "med-12345678-1234-1234-1234-123456789012",
      "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
      "title": "Annual Checkup",
      "description": "Routine annual physical examination",
      "date": "2025-08-09",
      "doctor": "Dr. Smith",
      "diagnosis": "Healthy",
      "treatment": "No treatment needed",
      "medications": ["None"],
      "notes": "Patient is in good health",
      "createdAt": "2025-08-09T07:25:27.463Z",
      "updatedAt": "2025-08-09T07:25:27.463Z"
    }
  ]
}
```

#### Update Medical Record
**PUT** `/medical-records/{recordId}`

Update an existing medical record.

**Request Body:**
```json
{
  "title": "Updated Annual Checkup",
  "notes": "Updated notes"
}
```

#### Delete Medical Record
**DELETE** `/medical-records/{recordId}`

Delete a medical record.

---

### 4. AI Chat

#### Chat with AI
**POST** `/chat`

Send a message to the AI assistant.

**Request Body:**
```json
{
  "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
  "message": "Hello, I have a question about my health",
  "conversationId": "conv-12345678-1234-1234-1234-123456789012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Hello! I'm here to help you with your health questions. What would you like to know?",
    "conversationId": "conv-12345678-1234-1234-1234-123456789012",
    "timestamp": "2025-08-09T07:25:27.463Z"
  }
}
```

---

### 5. Reminders

#### Save Reminder
**POST** `/save-reminder`

Create a new medication reminder.

**Request Body:**
```json
{
  "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
  "title": "Take medication",
  "description": "Remember to take your daily medication",
  "date": "2025-08-10",
  "time": "09:00",
  "priority": "high"
}
```

#### Get Reminders
**GET** `/reminders/user/{userId}`

Retrieve all reminders for a user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "reminderId": "rem-12345678-1234-1234-1234-123456789012",
      "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
      "title": "Take medication",
      "description": "Remember to take your daily medication",
      "date": "2025-08-10",
      "time": "09:00",
      "priority": "high",
      "completed": false,
      "createdAt": "2025-08-09T07:25:27.463Z"
    }
  ]
}
```

## 🧪 Testing with Postman

### Quick Setup

1. **Download Postman**: [postman.com/downloads](https://www.postman.com/downloads/)
2. **Import Collection**: Import `Medical-Assistant-API.postman_collection.json`
3. **Import Environment**: Import `Medical-Assistant-Environment.postman_environment.json`
4. **Select Environment**: Choose "Medical Assistant Dev" from the dropdown

### Test Sequence

1. **Test Endpoint** → Verify API connectivity
2. **Create User** → Get a userId for testing
3. **Update Environment** → Set the userId variable
4. **Test Other Endpoints** → Use the userId for user-specific operations

### Environment Variables

- `baseUrl`: `https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev`
- `userId`: Set after creating a user
- `recordId`: Set after creating a medical record

## 🖥️ Testing with cURL

### Test Endpoint
```bash
curl -X GET "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/test"
```

### Create User
```bash
curl -X POST "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1234567890"
  }'
```

### Get User Profile
```bash
curl -X GET "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/users/profile/YOUR_USER_ID"
```

### Create Medical Record
```bash
curl -X POST "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/medical-records" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "title": "Annual Checkup",
    "description": "Routine annual physical examination",
    "date": "2025-08-09",
    "doctor": "Dr. Smith",
    "diagnosis": "Healthy",
    "treatment": "No treatment needed",
    "medications": ["None"],
    "notes": "Patient is in good health"
  }'
```

### Chat with AI
```bash
curl -X POST "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "message": "Hello, I have a question about my health",
    "conversationId": "test-conversation"
  }'
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## ⚠️ Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

### Common Error Messages

- `"Missing Authentication Token"`: Invalid endpoint or HTTP method
- `"Validation error"`: Invalid request data format
- `"User with this email already exists"`: Email already registered
- `"Internal server error"`: Server-side error

## 📋 Data Models

### User
```typescript
interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Medical Record
```typescript
interface MedicalRecord {
  recordId: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

### Reminder
```typescript
interface Reminder {
  reminderId: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}
```

## 💡 Examples

### Complete User Workflow

1. **Create User**
```bash
curl -X POST "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1234567890"
  }'
```

2. **Get User Profile**
```bash
curl -X GET "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/users/profile/fa343de3-4b4d-45a5-a6a4-0f7307ab2659"
```

3. **Create Medical Record**
```bash
curl -X POST "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/medical-records" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
    "title": "Annual Checkup",
    "description": "Routine annual physical examination",
    "date": "2025-08-09",
    "doctor": "Dr. Smith",
    "diagnosis": "Healthy",
    "treatment": "No treatment needed",
    "medications": ["None"],
    "notes": "Patient is in good health"
  }'
```

4. **Chat with AI**
```bash
curl -X POST "https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "fa343de3-4b4d-45a5-a6a4-0f7307ab2659",
    "message": "What are the symptoms of a common cold?",
    "conversationId": "conv-12345678-1234-1234-1234-123456789012"
  }'
```

## 🔧 Troubleshooting

### "Missing Authentication Token" Error
- **Cause**: Invalid URL or HTTP method
- **Solution**: Verify the endpoint URL and HTTP method
- **Example**: Use `GET /test` not `GET /` (root path)

### Validation Errors
- **Cause**: Missing required fields or invalid data format
- **Solution**: Check the request body against the data models
- **Example**: Ensure `email`, `firstName`, `lastName` are provided for user creation

### 409 Conflict Error
- **Cause**: Resource already exists (e.g., email already registered)
- **Solution**: Use a unique email address or different identifier

### 500 Internal Server Error
- **Cause**: Server-side error
- **Solution**: Check the request format and try again later

## 📞 Support

For API support or questions:
- Check the error messages for specific issues
- Verify your request format matches the examples
- Ensure you're using the correct HTTP methods
- Test with the `/test` endpoint first to verify connectivity

## 🚀 Getting Started

1. **Test Connectivity**: Use the `/test` endpoint
2. **Create a User**: Use the `/users` endpoint
3. **Explore Features**: Try medical records, AI chat, and reminders
4. **Integrate**: Use the API in your frontend application

---

**Happy coding! 🏥💻** 