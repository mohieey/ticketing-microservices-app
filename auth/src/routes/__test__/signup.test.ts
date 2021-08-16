import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);
});

it("returns 400 if the email is invalid", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "fgfdgfdgrgreg", password: "password" })
    .expect(400);
});

it("returns 400 if the password is invalid", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "g" })
    .expect(400);
});

it("returns 400 with missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows dublicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(400);
});

it("sets a header after a successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
