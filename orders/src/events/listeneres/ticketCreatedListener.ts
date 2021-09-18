import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@ticmoh/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const newTicket = Ticket.build({ id, title, price });
    await newTicket.save();

    msg.ack();
  }
}
