import { Publisher, Subjects, TicketUpdatedEvent } from "@ticmoh/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
