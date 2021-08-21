import request from "supertest";
import { app } from "../../app";
import { createTicket } from "../../test/setup";

it("should return a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(4);
});
