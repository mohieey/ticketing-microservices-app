import express, { Response, Request } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@ticmoh/common";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

const Expiration_WINDOW_IN_SECONDS = 15 * 24;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((id) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("Ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticketInDb = await Ticket.findById(ticketId);
    if (!ticketInDb) {
      throw new NotFoundError();
    }

    const isReserved = await ticketInDb.isReserved();

    if (isReserved) {
      throw new BadRequestError("This ticket is already reserved");
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + Expiration_WINDOW_IN_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiresAt,
      ticket: ticketInDb,
    });
    await order.save();

    return res.status(201).send(order);
  }
);

export { router as newOrderRouter };
