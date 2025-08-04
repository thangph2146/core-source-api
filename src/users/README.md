# Users API

## Tổng quan

Users API cung cấp các endpoint CRUD cơ bản cho quản lý users, sử dụng Prisma với PostgreSQL database.

## Schema Database

Theo `schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

### 1. GET /users
- **Mô tả**: Lấy tất cả users
- **Response**: `User[]`
- **Status**: 200 OK

### 2. GET /users/:id
- **Mô tả**: Lấy user theo ID
- **Response**: `User | null`
- **Status**: 200 OK

### 3. POST /users
- **Mô tả**: Tạo user mới
- **Body**: `{ email: string, name?: string }`
- **Response**: `User`
- **Status**: 201 Created

### 4. PUT /users/:id
- **Mô tả**: Cập nhật user
- **Body**: `{ email?: string, name?: string }`
- **Response**: `User`
- **Status**: 200 OK

### 5. DELETE /users/:id
- **Mô tả**: Xóa user
- **Response**: `User`
- **Status**: 200 OK

## Test Cases

### Unit Tests
- **File**: `users.service.spec.ts`
- **Coverage**: Tất cả methods trong UsersService
- **Mock**: PrismaService

### Controller Tests
- **File**: `users.controller.spec.ts`
- **Coverage**: Tất cả endpoints trong UsersController
- **Mock**: UsersService

### E2E Tests
- **File**: `test/users.e2e-spec.ts`
- **Coverage**: Tất cả API endpoints với database thực

## Test Scenarios

### ✅ Đã test thành công:

1. **GET /users**
   - Trả về mảng users
   - Kiểm tra cấu trúc User theo schema

2. **POST /users**
   - Tạo user với đầy đủ thông tin
   - Tạo user không có name (optional)
   - Xử lý duplicate email (unique constraint)

3. **GET /users/:id**
   - Lấy user theo ID
   - Trả về empty object khi user không tồn tại

4. **PUT /users/:id**
   - Cập nhật name
   - Cập nhật email
   - Kiểm tra response structure

5. **DELETE /users/:id**
   - Xóa user thành công
   - Trả về thông tin user đã xóa

6. **Validation**
   - Unique constraint cho email
   - Optional name field
   - Type safety theo schema.prisma

## Chạy Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Tất cả tests
npm run test && npm run test:e2e
```

## Kết quả Test

- ✅ **Unit Tests**: 19 passed, 3 test suites
- ✅ **E2E Tests**: 11 passed, 2 test suites
- ✅ **Type Safety**: Theo schema.prisma
- ✅ **Database Integration**: PostgreSQL với Prisma
- ✅ **CRUD Operations**: Đầy đủ Create, Read, Update, Delete

## Lưu ý

1. **Email Validation**: Prisma không validate email format, chỉ đảm bảo unique
2. **Null Handling**: Controller trả về empty object `{}` khi user không tồn tại
3. **Type Safety**: Sử dụng User type từ Prisma generated client
4. **Database**: Kết nối PostgreSQL qua Neon database 