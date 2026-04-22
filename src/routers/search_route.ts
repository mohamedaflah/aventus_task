import { Router } from "express";
import { searchController } from "../modules/search/controller";
import { rateLimiter } from "../middlewares/rateLimiter";

const searchRouter = Router();

searchRouter.get(`/`,rateLimiter,searchController)

export default searchRouter;
