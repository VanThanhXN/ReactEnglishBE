# Các bước Deploy lên Railway

## ✅ Đã hoàn thành:
- [x] Đã sửa env variables trên Railway
- [x] Đã build code thành công (`yarn run build`)
- [x] Railway.json đã cấu hình Nixpacks

## 🚀 Các bước tiếp theo:

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Kiểm tra trên Railway Dashboard

**Kiểm tra Variables:**
- ✅ `DATABASE_URL` hoặc `DATABASE_PUBLIC_URL` đã được reference từ Postgres service
- ✅ `NODE_ENV` = `production`
- ✅ Đã xóa các biến `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USERNAME`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

**Kiểm tra Deploy:**
- Railway sẽ tự động detect code mới và deploy
- Hoặc click "Deploy" trong Railway dashboard

### 3. Chờ build và deploy hoàn tất
- Xem logs trong tab "Deployments" → chọn deployment mới nhất → "Logs"
- Đợi đến khi thấy: "Server đang chạy ở port..."

### 4. Chạy Migrations (QUAN TRỌNG!)

Sau khi service đã chạy thành công, bạn **PHẢI** chạy migrations để tạo tables trong database:

**Cách 1: Railway Dashboard (Dễ nhất)**
1. Vào service **ReactEnglishBE**
2. Click tab **"Deployments"** → chọn deployment mới nhất
3. Click tab **"Shell"**
4. Chạy lệnh:
   ```bash
   npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
   ```

**Cách 2: Railway CLI**
```bash
# Cài Railway CLI (nếu chưa có)
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Chạy migration
railway run npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
```

### 5. Kiểm tra kết quả

**Check logs:**
- Vào service → Deployments → Logs
- Tìm dòng: "Server đang chạy ở port XXXX"

**Test API:**
- Railway sẽ cung cấp URL public (ví dụ: `https://your-app.railway.app`)
- Test các endpoints: `/api/v1/...`

## ⚠️ Lưu ý quan trọng:

1. **Migrations**: Nếu không chạy migrations, database sẽ không có tables và app sẽ lỗi!

2. **Database Connection**: Đảm bảo `DATABASE_URL` đã được reference từ Postgres service

3. **NODE_ENV**: Phải là `production` để code chạy đúng đường dẫn `build/` thay vì `src/`

4. **Port**: Railway tự động set `PORT`, không cần set thủ công

## 🔍 Troubleshooting:

**Nếu build fail:**
- Kiểm tra logs trong Railway
- Đảm bảo `package.json` có script `build` và `start`

**Nếu database connection fail:**
- Kiểm tra `DATABASE_URL` đã được set chưa
- Kiểm tra Postgres service đang chạy

**Nếu app không start:**
- Kiểm tra logs
- Đảm bảo `NODE_ENV=production`
- Kiểm tra file `build/index.js` đã được tạo chưa

