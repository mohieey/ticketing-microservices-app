import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsWrapper";
import { TicketCreatedListener } from "./events/listeneres/ticketCreatedListener";
import { TicketUpdatedListener } from "./events/listeneres/ticketUpdatedListener";
import { ExpirationCompleteListener } from "./events/listeneres/expirationCompleteListener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is not defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is not defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is not defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    try {
      new TicketCreatedListener(natsWrapper.client).listen();
      new TicketUpdatedListener(natsWrapper.client).listen();
      new ExpirationCompleteListener(natsWrapper.client).listen();
    } catch (error: any) {
      console.log(error.message);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};

app.listen(3000, () => {
  console.log("listening on 3000");
});

start();
