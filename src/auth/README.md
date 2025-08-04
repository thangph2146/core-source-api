# Auth API

## Tổng quan

Auth API cung cấp các chức năng xác thực và phân quyền cho ứng dụng, bao gồm:
- Đăng ký tài khoản với xác thực email
- Đăng nhập với email/password
- Kiểm tra email tồn tại
- Xác thực email qua token
- Đăng xuất và quản lý session
- Tích hợp OAuth (Gmail) - placeholder

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String?  // Nullable for OAuth users
  isEmailVerified Boolean @default(false)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  authSessions AuthSession[]
  emailVerifications EmailVerification[]
}
```

### AuthSession Model
```prisma
model AuthSession {
  id        Int      @id @default(autoincrement())
  userId    Int
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### EmailVerification Model
```prisma
model EmailVerification {
  id        Int      @id @default(autoincrement())
  userId    Int
  email     String
  token     String   @unique
  expiresAt DateTime
  isUsed    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### 1. POST /auth/register
**Đăng ký tài khoản mới**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name" // optional
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "isEmailVerified": false,
    "avatar": null,
    "createdAt": "2025-08-04T13:53:13.000Z",
    "updatedAt": "2025-08-04T13:53:13.000Z"
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

### 2. POST /auth/login
**Đăng nhập**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "isEmailVerified": true,
    "avatar": null,
    "createdAt": "2025-08-04T13:53:13.000Z",
    "updatedAt": "2025-08-04T13:53:13.000Z"
  },
  "token": "abc123..."
}
```

### 3. GET /auth/verify-email
**Xác thực email**

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

### 4. GET /auth/check-email
**Kiểm tra email tồn tại**

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "exists": true
}
```

### 5. GET /auth/me
**Lấy thông tin user hiện tại**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "isEmailVerified": true,
    "avatar": null,
    "createdAt": "2025-08-04T13:53:13.000Z",
    "updatedAt": "2025-08-04T13:53:13.000Z"
  }
}
```

### 6. POST /auth/logout
**Đăng xuất**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

## Cấu hình Email

### 1. Tạo file .env
```env
# Email Configuration (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 2. Cấu hình Gmail App Password
1. Vào Google Account Settings
2. Bật 2-Factor Authentication
3. Tạo App Password cho ứng dụng
4. Sử dụng App Password thay vì password thường

## Test Cases

### ✅ Đã test thành công:

1. **POST /auth/register**
   - Đăng ký user mới thành công
   - Trả về user info và message
   - Tạo verification token
   - Fail với duplicate email

2. **GET /auth/check-email**
   - Kiểm tra email không tồn tại
   - Kiểm tra email đã tồn tại

3. **POST /auth/login**
   - Fail với email chưa verify
   - Fail với credentials sai

4. **GET /auth/verify-email**
   - Fail với token không hợp lệ

5. **GET /auth/me & POST /auth/logout**
   - Fail khi không có token

## Chạy Tests

```bash
# E2E tests cho Auth API
npm run test:e2e

# Tất cả tests
npm run test && npm run test:e2e
```

## Kết quả Test

- ✅ **Auth E2E Tests**: 8 passed
- ✅ **Users E2E Tests**: 11 passed  
- ✅ **App E2E Tests**: 1 passed
- ✅ **Total**: 20 passed tests

## Tính năng bảo mật

1. **Password Hashing**: Sử dụng bcrypt với salt rounds = 10
2. **Email Verification**: Token có thời hạn 24 giờ
3. **Session Management**: Token có thời hạn 7 ngày
4. **Unique Constraints**: Email phải unique
5. **Input Validation**: Kiểm tra email format và password strength

## OAuth Integration (Gmail)

Hiện tại đã có placeholder cho OAuth integration:

```typescript
async handleOAuthLogin(profile: any): Promise<{ user: User; token: string }>
```

Để implement đầy đủ, cần:
1. Cài đặt Passport.js
2. Cấu hình Google OAuth 2.0
3. Tạo OAuth routes
4. Xử lý callback

## Lưu ý

1. **Email Sending**: Trong test environment, email không được gửi thực tế
2. **Token Security**: Nên sử dụng JWT thay vì random token trong production
3. **Rate Limiting**: Nên thêm rate limiting cho login/register
4. **Password Policy**: Nên thêm validation cho password strength
5. **Environment Variables**: Cần cấu hình đầy đủ email credentials 