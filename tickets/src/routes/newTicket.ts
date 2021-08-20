import express, { Response, Request } from "express";
import { requireAuth, validateRequest } from "@ticmoh/common";
import { body } from "express-validator";

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
    return res.status(201).send();
  }
);

export { router as newTicketRouter };
