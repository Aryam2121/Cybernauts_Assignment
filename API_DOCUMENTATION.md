# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required. This can be added in future versions.

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message here",
  "details": "Optional additional details"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 404 | Not Found |
| 409 | Conflict - Duplicate or constraint violation |
| 500 | Internal Server Error |

## Endpoints

### 1. Get All Users

**GET** `/users`

Returns a list of all users.

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "John Doe",
    "age": 28,
    "hobbies": ["Reading", "Gaming"],
    "friends": ["friend-id-1", "friend-id-2"],
    "popularityScore": 3.5,
    "createdAt": "2025-11-07T10:00:00.000Z"
  }
]
```

### 2. Get Single User

**GET** `/users/:id`

Returns a single user by ID.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "John Doe",
  "age": 28,
  "hobbies": ["Reading", "Gaming"],
  "friends": ["friend-id-1"],
  "popularityScore": 2.0,
  "createdAt": "2025-11-07T10:00:00.000Z"
}
```

### 3. Create User

**POST** `/users`

Creates a new user.

**Request Body:**
```json
{
  "username": "Jane Smith",
  "age": 25,
  "hobbies": ["Cooking", "Yoga", "Photography"]
}
```

**Validation:**
- `username`: 2-50 characters, required
- `age`: 1-150, required
- `hobbies`: array, required (can be empty)

**Response (201):**
```json
{
  "id": "generated-uuid",
  "username": "Jane Smith",
  "age": 25,
  "hobbies": ["Cooking", "Yoga", "Photography"],
  "friends": [],
  "popularityScore": 0,
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

### 4. Update User

**PUT** `/users/:id`

Updates an existing user.

**Request Body:**
```json
{
  "username": "Jane Updated",
  "age": 26,
  "hobbies": ["Cooking", "Yoga", "Photography", "Swimming"]
}
```

All fields are optional.

**Response (200):**
```json
{
  "id": "user-id",
  "username": "Jane Updated",
  "age": 26,
  "hobbies": ["Cooking", "Yoga", "Photography", "Swimming"],
  "friends": ["friend-id"],
  "popularityScore": 2.5,
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

### 5. Delete User

**DELETE** `/users/:id`

Deletes a user. User must have no active friendships.

**Response (200):**
```json
{
  "message": "User deleted successfully",
  "id": "deleted-user-id"
}
```

**Error (409):**
```json
{
  "error": "Cannot delete user with active friendships. Please unlink all friends first.",
  "friendCount": 3
}
```

### 6. Link Users (Create Friendship)

**POST** `/users/:id/link`

Creates a mutual friendship between two users.

**Request Body:**
```json
{
  "friendId": "friend-user-id"
}
```

**Response (200):**
```json
{
  "message": "Friendship created successfully",
  "user": { /* updated user object */ },
  "friend": { /* updated friend object */ }
}
```

**Errors:**
- 400: `friendId` is required
- 400: User cannot be friends with themselves
- 404: User or friend not found
- 409: Users are already friends

### 7. Unlink Users (Remove Friendship)

**DELETE** `/users/:id/unlink`

Removes a friendship between two users.

**Request Body:**
```json
{
  "friendId": "friend-user-id"
}
```

**Response (200):**
```json
{
  "message": "Friendship removed successfully",
  "user": { /* updated user object */ },
  "friend": { /* updated friend object */ }
}
```

### 8. Get Graph Data

**GET** `/graph`

Returns all users as nodes and friendships as edges for graph visualization.

**Response (200):**
```json
{
  "nodes": [
    {
      "id": "user-id-1",
      "data": {
        "username": "John Doe",
        "age": 28,
        "hobbies": ["Reading", "Gaming"],
        "popularityScore": 3.5
      }
    }
  ],
  "edges": [
    {
      "id": "user-id-1-user-id-2",
      "source": "user-id-1",
      "target": "user-id-2"
    }
  ]
}
```

## Popularity Score Calculation

The popularity score is automatically calculated using this formula:

```
popularityScore = number of unique friends + (total hobbies shared with friends × 0.5)
```

**Example:**
1. User A has 2 friends (User B and User C)
2. User A shares 2 hobbies with User B
3. User A shares 3 hobbies with User C
4. Total shared hobbies = 5
5. Popularity Score = 2 + (5 × 0.5) = **4.5**

The score is recalculated automatically when:
- A friendship is created or removed
- User's hobbies are updated
- Friend's hobbies are updated

## Testing with cURL

### Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Test User",
    "age": 30,
    "hobbies": ["Reading", "Gaming"]
  }'
```

### Link Two Users
```bash
curl -X POST http://localhost:5000/api/users/{userId}/link \
  -H "Content-Type: application/json" \
  -d '{
    "friendId": "{friendId}"
  }'
```

### Get All Users
```bash
curl http://localhost:5000/api/users
```

### Get Graph Data
```bash
curl http://localhost:5000/api/graph
```

## Rate Limiting

Currently not implemented. Consider adding in production:
- Use `express-rate-limit` package
- Recommended: 100 requests per 15 minutes per IP

## CORS Configuration

By default, CORS is enabled for `http://localhost:3000`. To change:

Update `.env` file:
```
CORS_ORIGIN=https://your-frontend-domain.com
```

For multiple origins:
```typescript
// In server.ts
app.use(cors({
  origin: ['https://domain1.com', 'https://domain2.com'],
  credentials: true
}));
```
