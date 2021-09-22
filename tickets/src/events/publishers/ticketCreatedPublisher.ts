import { Publisher, Subjects, TicketCreatedEvent } from "@ticmoh/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
