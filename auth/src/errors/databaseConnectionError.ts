import { CustomError } from "./customError";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to the database";
  statusCode = 500;

  constructor() {
    super("Error connecting to the database");

    //Make this when you extend a built in class
    // Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors = () => {
    return [{ message: this.reason }];
  };
}
