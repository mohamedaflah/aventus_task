import express from "express";
import "dotenv/config";
import "./db/db.config";
import { connectRedis } from "./cache/redis.config";
import searchRouter from "./routers/search_route";
import { errorMiddleware } from "./middlewares/error.middleware";
import helmet from "helmet";
const app = express();
const port = process.env.PORT;
connectRedis();
app.use(helmet());
app.use(`/api/search`,searchRouter)
app.use(errorMiddleware)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;
