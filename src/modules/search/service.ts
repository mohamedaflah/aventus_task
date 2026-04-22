import redisClient from "../../cache/redis.config";
import { query } from "../../db/db.config";
import { buildQueryForSearch } from "./queryBuilder";

export const searchProductService = async (
  q: string,
  page: number,
  limit: number,
  sort?: string,
) => {
  const offset = (page - 1) * limit;

  const hasQuery = q && q.trim() !== "";
  const key = `search:${q || "all"}:${page}:${limit}:${sort || "default"}`;
  const cached = await redisClient.get(key);
  if (cached) {
    console.log("✅ Cache HIT");
    return JSON.parse(cached);
  }
  const sql = buildQueryForSearch(Boolean(hasQuery), sort);

  let result;

  if (!hasQuery) {
    // no search → only pagination
    result = await query(sql, [limit, offset]);
  } else {
    result = await query(sql, [q, limit, offset]);
  }
  const data = result.rows;

  await redisClient.set(key,JSON.stringify(data))

  return data;
};
