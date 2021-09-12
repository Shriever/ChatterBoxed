import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: "localhost",
  port: parseInt(process.env.DATABASE_PORT as string),
  database: process.env.DATABASE_NAME,
});
