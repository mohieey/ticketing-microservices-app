import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@ticmoh/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const existingOrder = await Order.findById(data.orderId);

    try {
      if (!existingOrder) {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.log(error);
      return;
    }

    existingOrder.set({
      status: OrderStatus.Complete,
    });
    await existingOrder.save();

    msg.ack();
  }
}
