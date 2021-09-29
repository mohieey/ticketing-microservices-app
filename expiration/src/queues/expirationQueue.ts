import Queue from "bull";
import { natsWrapper } from "../natsWrapper";
import { ExpirationCompletePublisher } from "./../events/publishers/expirationCompletePublisher";

interface PayLoad {
  orderId: string;
}

const expirationQueue = new Queue<PayLoad>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
