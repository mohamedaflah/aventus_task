# 🚀 Catalog Search Microservice

A high-performance product search microservice built with **Node.js**, **TypeScript**, **PostgreSQL**, and **Redis**. Implements full-text search with custom ranking, pagination, caching, and rate limiting.

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & routing |
| TypeScript | Type safety |
| PostgreSQL | Full-text search with `tsvector` |
| Redis | Caching & rate limiting |
| Docker | Service orchestration |

---

## 🏗️ Project Structure

```
src/
├── modules/
│   └── search/
│       ├── controller.ts
│       ├── service.ts
│       └── queryBuilder.ts
├── db/
│   ├── db.config.ts
│   └── seed.ts
├── cache/
│   └── redis.config.ts
├── middlewares/
│   ├── asyncHandler.ts
│   ├── error.middleware.ts
│   └── rateLimiter.ts
├── routes/
│   └── search.routes.ts
└── index.ts
```

---

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedaflah/aventus_task.git
cd aventus_task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
PORT=4001
DB_USER_NAME=search_user
DB_HOST=localhost
DB_NAME=search_db
DB_PASSWORD=search_123
DB_PORT=5432
REDIS_URL=redis://localhost:6379
```

### 4. Start Docker Services

PostgreSQL and Redis are managed via Docker Compose:

```bash
docker-compose --env-file .env -f docker/docker-compose.yml up -d
```

This will automatically:
- Create the `search_db` PostgreSQL database
- Start the Redis server

### 5. Seed the Database

```bash
npm run seed
```

This will:
- Create the `products` table
- Insert ~200 sample records
- Set up full-text search vectors
- Create a GIN index

### 6. Start the Server

```bash
npm run dev
```

Server runs at: `http://localhost:4001`

---

## 🔍 Search API

### Endpoint

```
GET /api/search
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `q` | string | No | Search term (omit to return all products) |
| `page` | number | Yes | Page number |
| `limit` | number | Yes | Items per page |
| `sort` | string | No | Sort order (see below) |

### Sort Options

| Value | Description |
|---|---|
| `price_asc` | Price: low to high |
| `price_desc` | Price: high to low |
| `title_asc` | Title: A to Z |

### Example Requests

```bash
# Search by query
GET /api/search?q=apple&page=1&limit=10

# Get all products (paginated)
GET /api/search?page=1&limit=10

# Search with sorting
GET /api/search?q=apple&sort=price_asc
GET /api/search?sort=price_desc
GET /api/search?sort=title_asc
```

### Example Response

```json
{
  "data": [
    {
      "id": 1,
      "title": "Apple Mobile Model 1",
      "brand": "Apple",
      "price": 500,
      "snippet": "...Apple Mobile...",
      "score": 1.23
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

## ⚡ Features

### 🔎 Full-Text Search
- Powered by PostgreSQL `tsvector`
- Weighted field ranking:
  - **Title** → High weight
  - **Brand** → Medium weight
  - **Description** → Low weight

### 🧠 Custom Ranking Boosts
- Exact title match boost
- Partial title match boost
- Brand match boost

### 🧾 Snippet Highlighting
- Uses PostgreSQL `ts_headline` to highlight matched terms in results

### 📄 Pagination
- Limit + offset based pagination

### ⚡ Performance
- GIN index on `search_vector` for fast lookups

### 🧊 Redis Caching
- Cache key: `q + page + limit + sort`
- TTL: 60 seconds

### 🛑 Rate Limiting
- IP-based rate limiting via Redis
- 10 requests per minute per IP

---

## 📌 NPM Scripts

```bash
npm run dev     # Start development server
npm run seed    # Seed the database with sample data
```

---

## 📝 Notes

- If `q` is omitted, the API returns all products with pagination applied.
- Ranking combines PostgreSQL `ts_rank` with custom business logic boosts for relevance tuning.
- Redis caching significantly improves response times for repeated identical queries.

---

## 👨‍💻 Author

**Mohamed Aflah**