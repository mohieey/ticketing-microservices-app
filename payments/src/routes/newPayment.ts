import express, { Response, Request } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@ticmoh/common";

import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const orderInDb = await Order.findById(orderId);

    if (!orderInDb) {
      throw new NotFoundError();
    }

    if (orderInDb.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (orderInDb.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for a cancelled order");
    }

    return res.send("dfdfdf");
  }
);

export { router as newPaymentRouter };
