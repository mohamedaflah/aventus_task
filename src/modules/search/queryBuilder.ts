export const buildQueryForSearch = (hasQuery: boolean,sort?: string) => {
  if (!hasQuery) {
    let orderBy = "ORDER BY id DESC";

    if (sort === "price_asc") orderBy = "ORDER BY price ASC";
    if (sort === "price_desc") orderBy = "ORDER BY price DESC";
    if (sort === "title_asc") orderBy = "ORDER BY title ASC";

    return `
      SELECT 
        id,
        title,
        brand,
        price,
        LEFT(description, 100) AS snippet,
        0 AS score
      FROM products
      ${orderBy}
      LIMIT $1 OFFSET $2;
    `;
  }

  let orderBy = "ORDER BY score DESC";

  if (sort === "price_asc") orderBy = "ORDER BY price ASC";
  if (sort === "price_desc") orderBy = "ORDER BY price DESC";
  if (sort === "title_asc") orderBy = "ORDER BY title ASC";

  return `
    SELECT 
      id,
      title,
      brand,
      price,
      ts_headline(description, plainto_tsquery($1)) AS snippet,

      (
        ts_rank(search_vector, plainto_tsquery($1)) +

        -- 🔥 Exact title match boost
        CASE 
          WHEN LOWER(title) = LOWER($1) THEN 1.0
          ELSE 0
        END +

        -- 🔥 Partial title match boost
        CASE 
          WHEN title ILIKE '%' || $1 || '%' THEN 0.5
          ELSE 0
        END +

        -- 🔥 Brand match boost
        CASE 
          WHEN brand ILIKE '%' || $1 || '%' THEN 0.3
          ELSE 0
        END

      ) AS score

    FROM products
    WHERE search_vector @@ plainto_tsquery($1)

    ${orderBy}

    LIMIT $2 OFFSET $3;
  `;
};
