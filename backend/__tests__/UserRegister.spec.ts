import supertest from "supertest";
import { app } from "../src/app";
import { User } from "../src/user/user";
import { sequelize } from "../src/config/database";

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

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

  it("saves the user to database", (done) => {
    supertest(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Password",
      })
      .then(() => {
        // query user table
        User.findAll().then((users) => {
          expect(users.length).toBe(1);
          done();
        });
      });
  });

  it("saves the username and email to database", (done) => {
    supertest(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@mail.com",
        password: "Password",
      })
      .then(() => {
        // query user table
        User.findAll().then((users) => {
          const savedUser = users[0];
          expect(savedUser.username).toBe("user1");
          expect(savedUser.email).toBe("user1@mail.com");
          done();
        });
      });
  });
});
