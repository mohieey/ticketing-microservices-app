import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { createCookie } from "../../test/setup";
import { OrderStatus } from "@ticmoh/common";

const buildTicket = async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 34 });
  await ticket.save();

  return ticket;
};

it("Maeks an order as Cancelled", async () => {
  const ticket = await buildTicket();
  const userCookie = createCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", userCookie)
    .send()
    .expect(204);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userCookie)
    .send()
    .expect(200);

  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
});
