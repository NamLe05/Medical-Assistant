# Medical Assistant API - Quick Reference

## 🌐 Base URL
```
https://kcp14joyd0.execute-api.us-west-2.amazonaws.com/dev
```

## 📡 Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/test` | Test API connectivity |
| `POST` | `/users` | Create new user |
| `GET` | `/users/profile/{userId}` | Get user profile |
| `PUT` | `/users/profile/{userId}` | Update user profile |
| `POST` | `/medical-records` | Create medical record |
| `GET` | `/medical-records/user/{userId}` | Get user's medical records |
| `PUT` | `/medical-records/{recordId}` | Update medical record |
| `DELETE` | `/medical-records/{recordId}` | Delete medical record |
| `POST` | `/chat` | Chat with AI |
| `POST` | `/save-reminder` | Save reminder |
| `GET` | `/reminders/user/{userId}` | Get user's reminders |

## 🧪 Quick Test Commands

### Test API
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
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

## ⚠️ Common Errors
- **"Missing Authentication Token"**: Wrong URL or HTTP method
- **"Validation error"**: Missing required fields
- **"User with this email already exists"**: Email already registered

## 🎯 Postman Files
- Collection: `Medical-Assistant-API.postman_collection.json`
- Environment: `Medical-Assistant-Environment.postman_environment.json`

---
*For detailed documentation, see `API_README.md`* 