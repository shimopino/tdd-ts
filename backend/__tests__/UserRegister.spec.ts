import supertest from "supertest";
import { app } from "../app";

describe("first", () => {
  it("should return 201 OK when signup request is valid", (done) => {
    supertest(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Password",
      })
      .expect(201, done);
  });
});
