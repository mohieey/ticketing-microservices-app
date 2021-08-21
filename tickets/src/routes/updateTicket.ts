import express, { Response, Request } from "express";
import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@ticmoh/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

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

    if (ticketInDB.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticketInDB.set({ title: req.body.title, price: req.body.price });
    await ticketInDB.save();

    res.status(204).send(ticketInDB);
  }
);

export { router as updateTicketRouter };
