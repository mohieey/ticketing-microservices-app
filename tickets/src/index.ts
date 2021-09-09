import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsWrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await natsWrapper.connect("ticketing", "alsdkj", "http://nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

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
