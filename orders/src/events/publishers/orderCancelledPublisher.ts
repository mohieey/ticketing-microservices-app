import { Publisher, Subjects, OrderCancelledEvent } from "@ticmoh/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
