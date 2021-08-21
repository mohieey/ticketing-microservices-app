import request from "supertest";
import { app } from "../../app";

it("should return the details of the current user", async () => {
  const authResponse = await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  const cookie = authResponse.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("user@example.com");
});

it("should response with null if not authnicated", async () => {
  const response = await request(app).get("/api/users/currentuser").send();

  expect(response.body.currentUser).toEqual(null);
});
