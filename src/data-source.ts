import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
// import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false, // nên tắt để dùng migration
  logging: true,
  entities: ["src/entity/*.ts", "src/entity/**/*.ts"],
  migrations: ["src/migration/*.ts", "src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  ssl: !!process.env.POSTGRES_SSL,
});
// Quy trình làm việc chuẩn với Migration
// 1. Tạo hoặc chỉnh sửa Entity
// 2. Sinh ra migration mới
//   - Ví dụ: npm run typeorm migration:generate -- ./src/migration/CreateUserTable -d ./src/data-source.ts
// 3. Thực thi Migration (áp dụng thay đổi vào DB)
// - Ví dụ: npm run typeorm migration:run -- -d ./src/data-source.ts
// 4. Nếu cần, revert migration: npm run typeorm migration:revert -- -d ./src/data-source.ts
// Tham khảo thêm tài liệu về Migration tại: https://typeorm.io/migrations