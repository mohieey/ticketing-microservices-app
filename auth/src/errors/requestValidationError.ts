import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    //Make this when you extend a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
