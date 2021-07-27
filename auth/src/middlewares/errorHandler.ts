import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/requestValidationError";
import { DatabaseConnectionError } from "../errors/databaseConnectionError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof RequestValidationError) {
    console.log("req vaildation error");
  }

  if (error instanceof DatabaseConnectionError) {
    console.log("DB error");
  }

  res.status(400).send({ message: error.message });
};
