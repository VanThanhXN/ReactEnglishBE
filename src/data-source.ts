import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
// import { User } from "./entity/User";

// Hỗ trợ DATABASE_URL từ Railway hoặc các biến môi trường riêng lẻ
function getDatabaseConfig() {
  // Railway cung cấp DATABASE_URL dạng: postgresql://user:password@host:port/database
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      type: "postgres" as const,
      host: url.hostname,
      port: Number(url.port) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Bỏ dấu / ở đầu
      ssl: url.searchParams.get("sslmode") !== "disable" || !!process.env.POSTGRES_SSL,
    };
  }

  // Fallback về các biến môi trường riêng lẻ
  return {
    type: "postgres" as const,
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: !!process.env.POSTGRES_SSL,
  };
}

// Xác định đường dẫn dựa trên môi trường (development: src/, production: build/)
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "build" : "src";
const fileExtension = isProduction ? "js" : "ts";

export const AppDataSource = new DataSource({
  ...getDatabaseConfig(),
  synchronize: false, // nên tắt để dùng migrationx
  logging: true, // display query in console , ex: SELECT * FROM ...
  entities: [`${basePath}/entity/**/*.${fileExtension}`], // chỉ cho TypeORM biết nơi tìm các entity
  migrations: [`${basePath}/migration/**/*.${fileExtension}`], // chú ý cái này, tránh duplicate
  subscribers: [`${basePath}/subscriber/**/*.${fileExtension}`],
});
// Quy trình làm việc chuẩn với Migration
// 1. Tạo entity
// 2. Tạo migration : npx typeorm-ts-node-commonjs migration:generate ./src/migration/CreateUserTable -d src/data-source.ts 
// 3. Chạy migration: npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts



