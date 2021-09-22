import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@ticmoh/common";

import { TicketUpdatedListener } from "../ticketUpdatedListener";
import { natsWrapper } from "../../../natsWrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Test Concert",
    price: 568,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "New Title",
    price: 485,
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("should not call ack if the event is out of order", async () => {
  const { listener, data, msg } = await setup();
  data.version = 45;

  await listener.onMessage(data, msg);

  expect(msg.ack).not.toHaveBeenCalled();
});
