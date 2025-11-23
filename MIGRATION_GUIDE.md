# Hướng dẫn Chạy Migrations trên Railway

## Vấn đề:
Lỗi: `relation "user" does not exist` - Database chưa có tables, cần chạy migrations.

## Cách chạy Migrations trên Railway:

### Cách 1: Sử dụng npm script (Đơn giản nhất) ✅

1. Vào service **zesty-exploration** trên Railway
2. Tab **"Deployments"** → chọn deployment đang chạy
3. Tab **"Shell"**
4. Chạy:
   ```bash
   npm run migration:run
   ```

### Cách 2: Chạy trực tiếp với build file

Nếu cách 1 không được, thử:
```bash
NODE_ENV=production npx typeorm-ts-node-commonjs migration:run -d build/data-source.js
```

### Cách 3: Chạy với ts-node (nếu có source files)

Nếu Railway có cả source files:
```bash
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

## Kiểm tra kết quả:

Sau khi chạy thành công, bạn sẽ thấy:
```
Migration CreateUserTable1763879045395 has been executed successfully.
```

## Nếu vẫn lỗi:

### Lỗi: "Cannot find module"
- Đảm bảo đã build code: `npm run build`
- Kiểm tra file `build/data-source.js` có tồn tại không

### Lỗi: "No migrations found"
- Kiểm tra file `build/migration/` có file `.js` không
- Đảm bảo migration files đã được build

### Lỗi: Database connection
- Kiểm tra `DATABASE_URL` đã được set trong Variables
- Kiểm tra Postgres service đang chạy

## Sau khi chạy migrations:

Test lại API - lỗi `relation "user" does not exist` sẽ hết!

