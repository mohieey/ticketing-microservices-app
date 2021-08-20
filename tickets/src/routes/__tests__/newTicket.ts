import request from "supertest";
import { app } from "../../app";
import jwt from "jsonwebtoken";
import { Ticket } from "../../models/ticket";

const signup = () => {
  const payload = { id: "idsjuihe", email: "test@test.com" };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return `express:sess=${base64}`;
};

it("should listen to post requests on /api/tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("is only accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).toEqual(401);
});

it("returns a status code other than 401 if the user is signed in", async () => {
  const cookie = signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = signup();

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
  const cookie = signup();

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

  const cookie = signup();

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
