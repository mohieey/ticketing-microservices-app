import express, { Response, Request } from "express";
import { requireAuth, validateRequest, NotFoundError } from "@ticmoh/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const ticketsInDB = await Ticket.find({});

  //   if (!ticketInDB) {
  //     throw new NotFoundError();
  //   }

  return res.status(200).send(ticketsInDB);
});

export { router as getAllTicketsRouter };
