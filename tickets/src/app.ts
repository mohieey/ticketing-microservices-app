import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@ticmoh/common";

//Routes
import { newTicketRouter } from "./routes/newTicket";
import { getTicketRouter } from "./routes/getTicket";
import { getAllTicketsRouter } from "./routes/getAllTickets";
// import { signoutRouter } from "./routes/signout";
//Middlewares

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);

app.use(newTicketRouter);
app.use(getTicketRouter);
app.use(getAllTicketsRouter);
// app.use(signoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
