import { Publisher, Subjects, PaymentCreatedEvent } from "@ticmoh/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
