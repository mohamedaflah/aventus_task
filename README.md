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

## 📡 API Reference

### Base URL

```
http://localhost:4001
```

---

### `GET /api/search`

Search and retrieve products with full-text ranking, pagination, and optional sorting.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `q` | `string` | No | — | Search keyword. Omit to return all products. |
| `page` | `number` | Yes | — | Page number (1-based) |
| `limit` | `number` | Yes | — | Number of results per page |
| `sort` | `string` | No | relevance | Sort order (see options below) |

#### Sort Values

| Value | Description |
|---|---|
| `price_asc` | Price: low → high |
| `price_desc` | Price: high → low |
| `title_asc` | Title: A → Z |

#### Request Examples

```bash
# Full-text search
GET /api/search?q=apple&page=1&limit=10

# Browse all products (no search term)
GET /api/search?page=1&limit=10

# Search + sort by price ascending
GET /api/search?q=apple&page=1&limit=10&sort=price_asc

# Browse all, sort by price descending
GET /api/search?page=1&limit=10&sort=price_desc

# Search + sort by title
GET /api/search?q=apple&page=1&limit=10&sort=title_asc
```

#### Response

**`200 OK`**

```json
{
  "data": [
    {
      "id": 117,
      "title": "Apple Headphones Model 117",
      "brand": "Apple",
      "price": "1072",
      "snippet": "This is a <b>Apple</b> Headphones with great features and performance",
      "score": 1.4822293996810914
    },
    {
      "id": 101,
      "title": "Apple Laptop Model 101",
      "brand": "Apple",
      "price": "1058",
      "snippet": "This is a <b>Apple</b> Laptop with great features and performance",
      "score": 1.4822293996810914
    }
  ],
  "page": 1,
  "limit": 10
}
```

#### Response Fields

| Field | Type | Description |
|---|---|---|
| `data` | `array` | List of matched product objects |
| `data[].id` | `number` | Unique product ID |
| `data[].title` | `string` | Product title |
| `data[].brand` | `string` | Brand name |
| `data[].price` | `string` | Product price |
| `data[].snippet` | `string` | Highlighted excerpt with matched terms wrapped in `<b>` tags |
| `data[].score` | `number` | Relevance score computed by PostgreSQL `ts_rank` + custom boosts |
| `page` | `number` | Current page number |
| `limit` | `number` | Number of results returned per page |

#### Error Responses

| Status | Description |
|---|---|
| `400 Bad Request` | Missing required parameters (`page` or `limit`) |
| `429 Too Many Requests` | Rate limit exceeded — max 10 requests/min per IP |
| `500 Internal Server Error` | Unexpected server error |

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