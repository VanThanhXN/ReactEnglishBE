# Hướng dẫn Deploy lên Railway

## Các bước deploy:

### 1. Tạo tài khoản Railway
- Truy cập https://railway.app
- Đăng ký/Đăng nhập bằng GitHub

### 2. Tạo Project mới
- Click "New Project"
- Chọn "Deploy from GitHub repo"
- Chọn repository của bạn

### 3. Thêm PostgreSQL Database
- Trong project, click "New" → "Database" → "Add PostgreSQL"
- Railway sẽ tự động tạo database và cung cấp biến môi trường `DATABASE_URL`

### 4. Cấu hình Environment Variables
Railway sẽ tự động detect `DATABASE_URL` từ PostgreSQL service. Nếu cần thêm biến môi trường khác:
- Vào "Variables" tab trong project
- Thêm các biến cần thiết:
  - `NODE_ENV=production`
  - `PORT` (Railway tự động set, không cần set thủ công)
  - Các biến khác nếu có (JWT_SECRET, EMAIL config, etc.)

### 5. Chạy Migrations (Quan trọng!)
Sau khi deploy, bạn cần chạy migrations để tạo tables trong database:

**Cách 1: Sử dụng Railway CLI**
```bash
# Cài Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Chạy migration
railway run npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

**Cách 2: Sử dụng Railway Dashboard**
- Vào "Deployments" → Click vào deployment mới nhất
- Mở "Shell" tab
- Chạy: `npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts`

### 6. Deploy
- Railway sẽ tự động deploy khi bạn push code lên GitHub
- Hoặc click "Deploy" trong Railway dashboard

## Cấu trúc files đã tạo:

- `railway.json`: Cấu hình Railway (build command, start command)
- `nixpacks.toml`: Cấu hình build process với Nixpacks
- `src/data-source.ts`: Đã được cập nhật để hỗ trợ `DATABASE_URL` từ Railway

## Lưu ý:

1. **Database Connection**: Ứng dụng sẽ tự động sử dụng `DATABASE_URL` nếu có, nếu không sẽ fallback về các biến môi trường riêng lẻ.

2. **Port**: Railway tự động set biến `PORT`, ứng dụng sẽ sử dụng port này.

3. **Migrations**: Nhớ chạy migrations sau khi deploy lần đầu!

4. **SSL**: Railway PostgreSQL tự động có SSL, ứng dụng sẽ tự động enable SSL khi detect `DATABASE_URL`.

## Troubleshooting:

- Nếu build fail: Kiểm tra logs trong Railway dashboard
- Nếu database connection fail: Kiểm tra `DATABASE_URL` đã được set chưa
- Nếu migrations fail: Đảm bảo đã chạy migrations sau khi deploy

