import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { createCookie } from "../../test/setup";
import { natsWrapper } from "./../../natsWrapper";

it("should listen to post requests on /api/tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("is only accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).toEqual(401);
});

it("returns a status code other than 401 if the user is signed in", async () => {
  const cookie = createCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = createCookie();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "", price: 23 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ price: 23 })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  const cookie = createCookie();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "ticketTitle", price: -23 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "ticketTitle" })
    .expect(400);
});

it("creats a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = createCookie();

  const title = "ticketTitle";
  const price = 23;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it("publish an event", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = createCookie();

  const title = "ticketTitle";
  const price = 23;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
