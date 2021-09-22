import { OrderCancelledEvent, OrderStatus } from "@ticmoh/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCancelledListener } from "./../orderCancelledListener";
import { natsWrapper } from "../../../natsWrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Test Concert",
    price: 546,
    userId: mongoose.Types.ObjectId().toHexString(),
  });

  const orderId = mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket, orderId };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
