import supertest from "supertest";
import { app } from "../src/app";

describe("User Register", () => {
  it("should return 201 OK when signup request is valid", (done) => {
    supertest(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Password",
      })
      .then((res) => {
        expect(res.status).toBe(201);
        done();
      });
  });

  it("should return success message when signup request is valid", (done) => {
    supertest(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Password",
      })
      .then((res) => {
        expect(res.body.message).toBe("User Created");
        done();
      });
  });
});
