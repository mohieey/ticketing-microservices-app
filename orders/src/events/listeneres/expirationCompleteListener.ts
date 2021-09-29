import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@ticmoh/common";

import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "./../publishers/orderCancelledPublisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const existingOrder = await Order.findById(data.orderId).populate("ticket");

    try {
      if (!existingOrder) {
        throw new Error(`Order No. ${data.orderId} Not Found`);
      }
    } catch (error) {
      console.log(error);
      return;
    }

    existingOrder.set({ status: OrderStatus.Cancelled });
    await existingOrder.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: existingOrder.id,
      version: existingOrder.version,
      ticket: { id: existingOrder.ticket.id },
    });

    msg.ack();
  }
}
