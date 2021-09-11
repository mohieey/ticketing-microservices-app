import express, { Response, Request } from "express";
import { requireAuth, validateRequest } from "@ticmoh/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

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
    //   if (!ticketInDB) {
    //     throw new NotFoundError();
    //   }

    return res.send({});
  }
);

export { router as newOrderRouter };
