import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from "@ticmoh/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const orderInDB = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    try {
      if (!orderInDB) {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.log(error);
      return;
    }

    orderInDB.set({ status: OrderStatus.Cancelled });
    await orderInDB.save();

    msg.ack();
  }
}
