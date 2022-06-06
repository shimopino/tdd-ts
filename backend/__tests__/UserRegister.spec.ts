import supertest from "supertest";
import { app } from "../src/app";
import { User } from "../src/user/user";
import { sequelize } from "../src/config/database";
import { interactsWithMail } from "nodemailer-stub";
import * as EmailService from "../src/email/EmailService";

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

const postUser = async (user = validUser, options = { language: "en" }) => {
  return supertest(app)
    .post("/api/1.0/users")
    .set("Accept-Language", options.language)
    .send(user);
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

  const username_null = "Username cannot be null";
  const username_size = "Must have min 4 and max 32 characters";
  const email_null = "Email cannot be null";
  const email_invalid = "Email is not valid";
  const password_null = "Password cannot be null";
  const password_size = "Password must be at least 6 characters";
  const password_pattern =
    "Password must be at least 1 uppercase, 1 lowercase letter and 1 number";
  const email_in_use = "Email in use";

  it.each`
    field         | value              | message
    ${"username"} | ${null}            | ${username_null}
    ${"username"} | ${"les"}           | ${username_size}
    ${"username"} | ${"a".repeat(33)}  | ${username_size}
    ${"email"}    | ${null}            | ${email_null}
    ${"email"}    | ${"mail.com"}      | ${email_invalid}
    ${"email"}    | ${"user.mail.com"} | ${email_invalid}
    ${"email"}    | ${"user@mail"}     | ${email_invalid}
    ${"password"} | ${null}            | ${password_null}
    ${"password"} | ${"P4ssw"}         | ${password_size}
    ${"password"} | ${"lowercase"}     | ${password_pattern}
    ${"password"} | ${"UPPERCASE"}     | ${password_pattern}
    ${"password"} | ${"1234567890"}    | ${password_pattern}
    ${"password"} | ${"lowerUPPER"}    | ${password_pattern}
    ${"password"} | ${"lower12345"}    | ${password_pattern}
    ${"password"} | ${"UPPER12345"}    | ${password_pattern}
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

  it(`returns ${email_in_use} when same email is already in use`, async () => {
    await User.create({ ...validUser });

    const response = await postUser();

    const body = response.body;
    expect(body.validationErrors.email).toBe(email_in_use);
  });

  it("returns errors for both username is null and email is in use", async () => {
    await User.create({ ...validUser });

    const response = await postUser({
      username: null,
      email: validUser.email,
      password: validUser.password,
    });

    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });

  it("creates user in inactive mode", async () => {
    await postUser();

    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBeTruthy();
  });

  it("creates user in inactive mode even the request bodt contains inactive", async () => {
    const newUser = { ...validUser, inactive: false };
    await postUser(newUser);

    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBeTruthy();
  });

  it("creates an activationTolen for user", async () => {
    await postUser();

    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.activationToken.length).toBe(16);
  });

  it("sends an Account activation email with activationToken", async () => {
    await postUser();

    const lastMail = interactsWithMail.lastMail();
    expect(lastMail.to[0]).toContain("user1@mail.com");

    const users = await User.findAll();
    const savedUser = users[0];
    expect(lastMail.content).toContain(savedUser.activationToken);
  });

  it("returns 502 Bad Gateway when sending email fails", async () => {
    const mockSendAccountActivation = jest
      .spyOn(EmailService, "sendAccountActivation")
      .mockRejectedValueOnce({
        message: "Failed to deliver email",
      });
    const response = await postUser();

    expect(response.status).toBe(502);

    mockSendAccountActivation.mockRestore();
  });

  it("returns email failure when sending email fails", async () => {
    const mockSendAccountActivation = jest
      .spyOn(EmailService, "sendAccountActivation")
      .mockRejectedValueOnce({
        message: "Failed to deliver email",
      });
    const response = await postUser();

    expect(response.body.message).toBe("Email Failure");

    mockSendAccountActivation.mockRestore();
  });

  describe("Internationalization", () => {
    const username_null = "ユーザー名にNullを指定できません";
    const username_size = "4文字から32文字までの長さを指定してください";
    const email_null = "メールアドレスにNullを指定できません";
    const email_invalid = "メールアドレスが有効ではありません";
    const password_null = "パスワードにNullを指定できません";
    const password_size = "パスワードは最小で6文字を指定してください";
    const password_pattern =
      "パスワードには最低でも大文字1文字、小文字1文字、数字1文字を含んでいる必要があります";
    const email_in_use = "メールアドレスは既に使用されています";
    const user_create_success = "ユーザーを作成しました";

    it.each`
      field         | value              | message
      ${"username"} | ${null}            | ${username_null}
      ${"username"} | ${"les"}           | ${username_size}
      ${"username"} | ${"a".repeat(33)}  | ${username_size}
      ${"email"}    | ${null}            | ${email_null}
      ${"email"}    | ${"mail.com"}      | ${email_invalid}
      ${"email"}    | ${"user.mail.com"} | ${email_invalid}
      ${"email"}    | ${"user@mail"}     | ${email_invalid}
      ${"password"} | ${null}            | ${password_null}
      ${"password"} | ${"P4ssw"}         | ${password_size}
      ${"password"} | ${"lowercase"}     | ${password_pattern}
      ${"password"} | ${"UPPERCASE"}     | ${password_pattern}
      ${"password"} | ${"1234567890"}    | ${password_pattern}
      ${"password"} | ${"lowerUPPER"}    | ${password_pattern}
      ${"password"} | ${"lower12345"}    | ${password_pattern}
      ${"password"} | ${"UPPER12345"}    | ${password_pattern}
    `(
      "returns $message when $field is $value",
      async ({ field, value, message }) => {
        const user = {
          username: "user1",
          email: "user1@mail.com",
          password: "Password",
        };
        user[field] = value;

        const response = await postUser(user, { language: "ja" });

        const body = response.body;
        expect(body.validationErrors[field]).toBe(message);
      }
    );

    it(`returns ${email_in_use} when same email is already in use`, async () => {
      await User.create({ ...validUser });

      const response = await postUser({ ...validUser }, { language: "ja" });

      const body = response.body;
      expect(body.validationErrors.email).toBe(email_in_use);
    });

    it(`returns success message of ${user_create_success} when signup request is valid`, async () => {
      const response = await postUser({ ...validUser }, { language: "ja" });
      expect(response.body.message).toBe(user_create_success);
    });
  });
});
