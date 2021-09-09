import request from "supertest";
import { app } from "../../app";
import { createCookie, createTicket } from "../../test/setup";
import mongoose from "mongoose";
import { response } from "express";

const newTitle = "New Titile";
const newPrice = 45;

it("should return 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", createCookie())
    .send({ title: newTitle, price: newPrice })
    .expect(404);
});

it("should return 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: newTitle, price: newPrice })
    .expect(401);
});

it("should return 401 if the user is authenticated but not the creator of the ticket", async () => {
  const response = await createTicket();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", createCookie())
    .send({ title: newTitle, price: newPrice })
    .expect(401);
});

it("should return 400 if the user provides invalid title or price", async () => {
  const cookie = createCookie();

  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ price: newPrice })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle })
    .expect(400);
});

it("should update the ticket with valid title and price", async () => {
  const cookie = createCookie();

  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});
