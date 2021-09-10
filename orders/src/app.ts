import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@ticmoh/common";

//Routes
import { newOrderRouter } from "./routes/newOrder";
import { getOrderRouter } from "./routes/getOrder";
import { getAllOrdersRouter } from "./routes/getAllOrders";
import { deleteOrderRouter } from "./routes/deleteOrder";
// import { signoutRouter } from "./routes/signout";
//Middlewares

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);

app.use(newOrderRouter);
app.use(getOrderRouter);
app.use(getAllOrdersRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
