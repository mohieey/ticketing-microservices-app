import Queue from "bull";

interface PayLoad {
  orderId: string;
}

const expirationQueue = new Queue<PayLoad>("order:expiration", {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job) => {
  console.log("LOOOOOOOOOOOOOOOL", job.data.orderId);
});

export { expirationQueue };
