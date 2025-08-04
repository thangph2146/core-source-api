# Prisma Setup Guide

## Cài đặt và cấu hình Prisma

Dự án đã được cấu hình với Prisma để kết nối với cơ sở dữ liệu PostgreSQL.

### Cấu hình Database

File `prisma/schema.prisma` đã được cấu hình với URL kết nối PostgreSQL:
```
postgresql://neondb_owner:npg_fqTPM64Hgymx@ep-steep-hall-a1f8yl1j-pooler.ap-southeast-1.aws.neon.tech/core-source-api?sslmode=require&channel_binding=require
```

### Các lệnh Prisma hữu ích

1. **Tạo migration mới:**
   ```bash
   npx prisma migrate dev --name <tên_migration>
   ```

2. **Áp dụng migration vào production:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Tạo Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Xem database trong Prisma Studio:**
   ```bash
   npx prisma studio
   ```

5. **Pull schema từ database:**
   ```bash
   npx prisma db pull
   ```

### Sử dụng Prisma trong code

#### Import PrismaService
```typescript
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class YourService {
  constructor(private prisma: PrismaService) {}
}
```

#### Các thao tác CRUD cơ bản

**Tạo record:**
```typescript
const user = await this.prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe'
  }
});
```

**Tìm tất cả:**
```typescript
const users = await this.prisma.user.findMany();
```

**Tìm theo ID:**
```typescript
const user = await this.prisma.user.findUnique({
  where: { id: 1 }
});
```

**Cập nhật:**
```typescript
const updatedUser = await this.prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' }
});
```

**Xóa:**
```typescript
const deletedUser = await this.prisma.user.delete({
  where: { id: 1 }
});
```

### API Endpoints

Sau khi chạy ứng dụng, bạn có thể truy cập các endpoint sau:

- `GET /users` - Lấy tất cả users
- `GET /users/:id` - Lấy user theo ID
- `POST /users` - Tạo user mới
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Ví dụ request

**Tạo user mới:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

**Lấy tất cả users:**
```bash
curl http://localhost:3000/users
```

### Lưu ý bảo mật

⚠️ **Quan trọng:** URL database hiện tại được hardcode trong schema.prisma. Trong môi trường production, bạn nên sử dụng biến môi trường:

1. Tạo file `.env`:
   ```
   DATABASE_URL="postgresql://neondb_owner:npg_fqTPM64Hgymx@ep-steep-hall-a1f8yl1j-pooler.ap-southeast-1.aws.neon.tech/core-source-api?sslmode=require&channel_binding=require"
   ```

2. Cập nhật schema.prisma:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Thêm `.env` vào `.gitignore` để không commit thông tin nhạy cảm. 