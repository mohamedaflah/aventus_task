import { type Request, Response } from "express";
import { searchProductService } from "./service";
import { asyncHandler } from "../../middlewares/asyncHandler";
export const searchController = asyncHandler(
  async (req: Request, res: Response) => {
    const { q, page = "1", limit = "10", sort } = req.query;

    const results = await searchProductService(
      q as string,
      parseInt(page as string),
      parseInt(limit as string),
      sort as string,
    );

    res.json({
      data: results,
      page: Number(page),
      limit: Number(limit),
    });
  },
);
