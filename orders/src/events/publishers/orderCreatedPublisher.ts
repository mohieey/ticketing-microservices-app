import { Publisher, Subjects, OrderCreatedEvent } from "@ticmoh/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
