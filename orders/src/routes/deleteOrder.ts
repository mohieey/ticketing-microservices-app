import express, { Response, Request } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError } from "@ticmoh/common";

import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "./../events/publishers/orderCancelledPublisher";
import { natsWrapper } from "../natsWrapper";

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

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: orderInDb.id,
    version: orderInDb.version,
    ticket: {
      id: orderInDb.ticket.id,
    },
  });

  return res.status(204).send();
});

export { router as deleteOrderRouter };
