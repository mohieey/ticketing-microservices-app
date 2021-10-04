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
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "./../events/publishers/paymentCreatedPublisher";
import { natsWrapper } from "./../natsWrapper";

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

    const charge = await stripe.charges.create({
      amount: orderInDb.price * 100,
      currency: "usd",
      source: token,
      description: "Charging hte user for the ticket",
    });

    const newPayment = Payment.build({
      orderId,
      stripeId: charge.id,
      price: orderInDb.price,
    });
    await newPayment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: newPayment.id,
      orderId,
      stripeId: charge.id,
    });

    return res
      .status(201)
      .send({ status: "successful payment", paymentId: newPayment.id });
  }
);

export { router as newPaymentRouter };
