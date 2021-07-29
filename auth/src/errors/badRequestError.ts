import { CustomError } from "./customError";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
  }

  serializeErrors = () => {
    return [{ message: this.message }];
  };
}
