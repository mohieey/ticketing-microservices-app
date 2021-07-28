import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Not found");
  }

  serializeErrors = () => {
    return [{ message: "Not found" }];
  };
}
