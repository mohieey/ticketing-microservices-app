import express, { Response, Request } from "express";
import { requireAuth } from "@ticmoh/common";

import { Order } from "../models/order";

const router = express.Router();

router.get("/api/tickets", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUse!.id }).populate(
    "ticket"
  );

  return res.send(orders);
});

export { router as getAllOrdersRouter };
