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

const validUser = {
  username: "user1",
  email: "user1@mail.com",
  password: "Password",
};

const postUser = async (user = validUser) => {
  return supertest(app).post("/api/1.0/users").send(user);
};

describe("User Register", () => {
  it("should return 201 OK when signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(201);
  });

  it("should return success message when signup request is valid", async () => {
    const response = await postUser();
    expect(response.body.message).toBe("User Created");
  });

  it("saves the user to database", async () => {
    await postUser();

    // query user table
    const users = await User.findAll();
    expect(users.length).toBe(1);
  });

  it("saves the username and email to database", async () => {
    await postUser();

    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@mail.com");
  });

  it("hashed the password in database", async () => {
    await postUser();

    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.password).not.toBe("Password");
  });

  it("returns 400 when username is null", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "Password",
    });

    expect(response.status).toBe(400);
  });

  it("returns ValidationErrors fields in response body when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "Password",
    });

    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("returns errors for both when username and email is null", async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: "Password",
    });

    /**
     * validationErrors: {
     *   username: { ... },
     *   email: { ... },
     * }
     */
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });

  it("returns Username cannnot be null when username is null", async () => {
    const response = await postUser({
      username: null,
      email: "user1@mail.com",
      password: "Password",
    });

    const body = response.body;
    expect(body.validationErrors.username).toBe("Username cannot be null");
  });

  it("returns email cannnot be null when email is null", async () => {
    const response = await postUser({
      username: "user",
      email: null,
      password: "Password",
    });

    const body = response.body;
    expect(body.validationErrors.email).toBe("Email cannot be null");
  });

  it("returns Password cannot be null message when password is null", async () => {
    const response = await postUser({
      username: "user1",
      email: "user1@mail.com",
      password: null,
    });

    const body = response.body;
    expect(body.validationErrors.password).toBe("Password cannot be null");
  });
});
