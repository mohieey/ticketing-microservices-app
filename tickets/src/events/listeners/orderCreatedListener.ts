import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@ticmoh/common";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "./../publishers/ticketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticketInDB = await Ticket.findById(data.ticket.id);

    try {
      if (!ticketInDB) {
        throw new Error("Ticket not found");
      }
    } catch (error) {
      console.log(error);
      return;
    }

    ticketInDB.set({ orderId: data.id });
    await ticketInDB.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketInDB.id,
      price: ticketInDB.price,
      title: ticketInDB.title,
      version: ticketInDB.version,
      userId: ticketInDB.userId,
      orderId: ticketInDB.orderId,
    });

    msg.ack();
  }
}
