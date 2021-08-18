import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    console.log(error.message);
    return res
      .status(error.statusCode)
      .send({ errors: error.serializeErrors() });
  }

  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};
