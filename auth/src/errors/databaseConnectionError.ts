export class DatabaseConnectionError extends Error {
  reason = "Error connecting to the database";
  constructor() {
    super();

    //Make this when you extend a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
