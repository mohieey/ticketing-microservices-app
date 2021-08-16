import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");
  }

  serializeErrors = () => {
    return [{ message: "Not authoized" }];
  };
}
