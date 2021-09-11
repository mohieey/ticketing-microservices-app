import express, { Response, Request } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@ticmoh/common";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const orderInDb = await Order.findById(orderId).populate("ticket");

  if (!orderInDb) {
    throw new NotFoundError();
  }

  if (orderInDb.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  orderInDb.status = OrderStatus.Cancelled;
  await orderInDb.save();

  return res.status(204).send();
});

export { router as deleteOrderRouter };
