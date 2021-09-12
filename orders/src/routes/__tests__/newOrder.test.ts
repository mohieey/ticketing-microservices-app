import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { createCookie } from "../../test/setup";
import { natsWrapper } from "./../../natsWrapper";

it("Returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", createCookie())
    .send({ ticketId })
    .expect(404);
});

it("Returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 34 });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "rtopygijg",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", createCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("Reserves a ticket", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 34 });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", createCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Emits an event when an order is created", async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 34 });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", createCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
