import express, { Response, Request } from "express";
import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@ticmoh/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";
import { natsWrapper } from "./../natsWrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketInDB = await Ticket.findById(req.params.id);

    if (!ticketInDB) {
      throw new NotFoundError();
    }

    if (ticketInDB.orderId) {
      throw new BadRequestError("Can not update a reserved ticket");
    }

    if (ticketInDB.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticketInDB.set({ title: req.body.title, price: req.body.price });
    await ticketInDB.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticketInDB.id,
      version: ticketInDB.version,
      title: ticketInDB.title,
      price: ticketInDB.price,
      userId: ticketInDB.userId,
    });

    res.send(ticketInDB);
  }
);

export { router as updateTicketRouter };
