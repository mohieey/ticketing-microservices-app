import express, { Response, Request } from "express";
import { NotFoundError } from "@ticmoh/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticketInDB = await Ticket.findById(req.params.id);

  if (!ticketInDB) {
    throw new NotFoundError();
  }

  return res.status(200).send(ticketInDB);
});

export { router as getTicketRouter };
