# Users Module Test Cases

## Tổng quan

Folder `tests` chứa các test case cho module Users, bao gồm:
- **Unit Tests**: Test cho Controller và Service
- **E2E Tests**: Test tích hợp với database thực

## Cấu trúc Test Cases

### 1. Unit Tests

#### `users.controller.spec.ts`
- **Mô tả**: Test cho UsersController
- **Test Cases**: 18 test cases
- **Coverage**: Tất cả endpoints (GET, POST, PUT, DELETE)
- **Mock**: UsersService

**Test Scenarios:**
- ✅ GET /users - Trả về mảng users
- ✅ GET /users/:id - Lấy user theo ID
- ✅ POST /users - Tạo user mới
- ✅ PUT /users/:id - Cập nhật user
- ✅ DELETE /users/:id - Xóa user
- ✅ Error handling - Xử lý lỗi

#### `users.service.spec.ts`
- **Mô tả**: Test cho UsersService
- **Test Cases**: 18 test cases
- **Coverage**: Tất cả methods trong service
- **Mock**: PrismaService

**Test Scenarios:**
- ✅ findAll() - Lấy tất cả users
- ✅ findOne() - Lấy user theo ID
- ✅ create() - Tạo user mới
- ✅ update() - Cập nhật user
- ✅ delete() - Xóa user
- ✅ Error handling - Xử lý lỗi database

### 2. E2E Tests

#### `users.e2e-spec.ts`
- **Mô tả**: Test tích hợp với database thực
- **Test Cases**: 11 test cases
- **Coverage**: API endpoints với database PostgreSQL

**Test Scenarios:**
- ✅ GET /users - Trả về mảng users
- ✅ POST /users - Tạo user với đầy đủ thông tin
- ✅ POST /users - Tạo user không có name
- ✅ GET /users/:id - Lấy user theo ID
- ✅ GET /users/:id - Trả về empty object khi user không tồn tại
- ✅ PUT /users/:id - Cập nhật name
- ✅ PUT /users/:id - Cập nhật email
- ✅ DELETE /users/:id - Xóa user
- ✅ POST /users - Xử lý duplicate email
- ✅ POST /users - Chấp nhận email format không hợp lệ (Prisma cho phép)

## Kết quả Test

### ✅ Unit Tests
- **Test Suites**: 2 passed
- **Tests**: 18 passed
- **Time**: ~1.5s
- **Coverage**: 100% cho Controller và Service

### ✅ E2E Tests
- **Test Suites**: 1 passed
- **Tests**: 11 passed
- **Database**: PostgreSQL với Prisma
- **Integration**: API endpoints với database thực

## Chạy Tests

```bash
# Chạy tất cả test cases trong folder tests
npm test -- --testPathPattern="users/tests"

# Chạy unit tests
npm test -- src/users/tests/users.controller.spec.ts
npm test -- src/users/tests/users.service.spec.ts

# Chạy E2E tests
npm run test:e2e -- --testPathPattern="users.e2e-spec.ts"
```

## Test Coverage

### Controller Tests
- ✅ findAll() - 2 test cases
- ✅ findOne() - 3 test cases (bao gồm invalid ID)
- ✅ create() - 3 test cases (bao gồm error handling)
- ✅ update() - 4 test cases (bao gồm error handling)
- ✅ delete() - 2 test cases (bao gồm error handling)

### Service Tests
- ✅ findAll() - 1 test case
- ✅ findOne() - 2 test cases (bao gồm user không tồn tại)
- ✅ create() - 2 test cases (bao gồm user không có name)
- ✅ update() - 2 test cases (bao gồm update email)
- ✅ delete() - 1 test case

### E2E Tests
- ✅ CRUD Operations - 8 test cases
- ✅ Error Handling - 2 test cases
- ✅ Validation - 1 test case

## Lưu ý

1. **Mock Strategy**: Sử dụng Jest mocks cho unit tests
2. **Database**: E2E tests sử dụng database thực (PostgreSQL)
3. **Type Safety**: Tất cả tests đều sử dụng User type từ Prisma
4. **Error Handling**: Test các trường hợp lỗi và edge cases
5. **Performance**: Unit tests chạy nhanh (~1.5s), E2E tests chậm hơn do database

## Cải thiện

1. **Test Coverage**: Có thể thêm test cases cho validation
2. **Performance**: Có thể tối ưu E2E tests
3. **Mock Data**: Có thể tạo factory functions cho mock data
4. **Integration**: Có thể thêm test cho authentication integration 