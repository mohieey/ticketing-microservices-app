import express, { Response, Request } from "express";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  //   if (!ticketInDB) {
  //     throw new NotFoundError();
  //   }

  return res.send({});
});

export { router as getAllOrdersRouter };