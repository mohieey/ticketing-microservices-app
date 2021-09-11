import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { createCookie } from "../../test/setup";

const buildTicket = async () => {
  const ticket = Ticket.build({ title: "Test Ticket", price: 34 });
  await ticket.save();

  return ticket;
};

it("Returns the orders for the logged in user", async () => {
  const ticket = await buildTicket();
  const userCookie = createCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userCookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Returns not authorized if the user is trying to fetch another user's order", async () => {
  const ticket = await buildTicket();
  const userCookie = createCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", createCookie())
    .send()
    .expect(401);
});
