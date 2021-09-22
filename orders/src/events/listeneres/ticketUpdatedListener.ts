import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@ticmoh/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const existingTicket = await Ticket.findTicketByIdAndPreviousVersion({
      id,
      version,
    });

    try {
      if (!existingTicket) {
        throw new Error("Ticket not found");
      }
    } catch (error) {
      console.log(error);
      return;
    }

    existingTicket.set({ title, price });
    existingTicket.save();

    msg.ack();
  }
}
