import express, { Response, Request } from "express";
import { requireAuth, validateRequest } from "@ticmoh/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/ticketCreatedPublisher";
import { natsWrapper } from "./../natsWrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const newTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await newTicket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      version: newTicket.version,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
    });

    return res.status(201).send(newTicket);
  }
);

export { router as newTicketRouter };
