import { OrderCreatedEvent, OrderStatus } from "@ticmoh/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCreatedListener } from "./../orderCreatedListener";
import { natsWrapper } from "../../../natsWrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Test Concert",
    price: 546,
    userId: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: "fgjirjt",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg, ticket };
};

it("sets the order id for the reserved ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  //@ts-ignore
  console.log(natsWrapper.client.publish.mock.calls);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
