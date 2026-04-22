import "dotenv/config";
import { generateFakeProducts } from "../utils/generateFakeData";
import pool from "./db.config";

async function seedProducts() {
  const products = generateFakeProducts(200); // enough for pagination

  for (const p of products) {
    await pool.query(
      `
        INSERT INTO products (title, description, category, brand, price, search_vector)
        VALUES ($1, $2, $3, $4, $5,
          setweight(to_tsvector($1), 'A') ||
          setweight(to_tsvector($4), 'B') ||
          setweight(to_tsvector($2), 'C')
        )
      `,
      [p.title, p.description, p.category, p.brand, p.price],
    );
  }

  console.log("Seeding completed");
}

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT,
      description TEXT,
      category TEXT,
      brand TEXT,
      price NUMERIC,
      search_vector tsvector
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_search
    ON products USING GIN(search_vector);
  `);

  console.log("Table + index created");
}

async function run() {
  await createTable();

  // ✅ Clear old data
  await pool.query("TRUNCATE TABLE products RESTART IDENTITY;");

  await seedProducts();

  process.exit();
}

run();
