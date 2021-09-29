import { Publisher, Subjects, ExpirationCompleteEvent } from "@ticmoh/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
