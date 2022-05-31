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
  password: "P4ssword",
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
      password: "P4ssword",
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

  it.each`
    field         | value              | message
    ${"username"} | ${null}            | ${"Username cannot be null"}
    ${"username"} | ${"les"}           | ${"Must have min 4 and max 32 characters"}
    ${"username"} | ${"a".repeat(33)}  | ${"Must have min 4 and max 32 characters"}
    ${"email"}    | ${null}            | ${"Email cannot be null"}
    ${"email"}    | ${"mail.com"}      | ${"Email is not valid"}
    ${"email"}    | ${"user.mail.com"} | ${"Email is not valid"}
    ${"email"}    | ${"user@mail"}     | ${"Email is not valid"}
    ${"password"} | ${null}            | ${"Password cannot be null"}
    ${"password"} | ${"P4ssw"}         | ${"Password must be at least 6 characters"}
    ${"password"} | ${"lowercase"}     | ${"Password must be at least 1 uppercase, 1 lowercase letter and 1 number"}
    ${"password"} | ${"UPPERCASE"}     | ${"Password must be at least 1 uppercase, 1 lowercase letter and 1 number"}
    ${"password"} | ${"1234567890"}    | ${"Password must be at least 1 uppercase, 1 lowercase letter and 1 number"}
    ${"password"} | ${"lowerUPPER"}    | ${"Password must be at least 1 uppercase, 1 lowercase letter and 1 number"}
    ${"password"} | ${"lower12345"}    | ${"Password must be at least 1 uppercase, 1 lowercase letter and 1 number"}
    ${"password"} | ${"UPPER12345"}    | ${"Password must be at least 1 uppercase, 1 lowercase letter and 1 number"}
  `(
    "returns $message when $field is $value",
    async ({ field, value, message }) => {
      const user = {
        username: "user1",
        email: "user1@mail.com",
        password: "Password",
      };
      user[field] = value;

      const response = await postUser(user);

      const body = response.body;
      expect(body.validationErrors[field]).toBe(message);
    }
  );
});
