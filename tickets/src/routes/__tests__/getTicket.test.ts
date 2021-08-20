import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/setup";
import mongoose from "mongoose";

it("should return 404 if the ticket is unfound", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("should return the ticket if the ticket is found", async () => {
  const cookie = signup();

  const title = "ticketTitle";
  const price = 23;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
