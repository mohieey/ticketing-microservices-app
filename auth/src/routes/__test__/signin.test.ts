import request from "supertest";
import { app } from "../../app";

it("returns 400 if the email doesn't exist", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "user@example.com", password: "password" })
    .expect(400);
});

it("returns 400 if the password is wrong", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "user@example.com", password: "passwfhfghord" })
    .expect(400);
});

it("responds with a cookie if the credentails are valid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "user@example.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
