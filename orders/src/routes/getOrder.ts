import express, { Response, Request } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@ticmoh/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const orderInDb = await Order.findById(orderId).populate("ticket");

    if (!orderInDb) {
      throw new NotFoundError();
    }

    if (orderInDb.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    return res.send(orderInDb);
  }
);

export { router as getOrderRouter };
