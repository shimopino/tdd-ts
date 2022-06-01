import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import { CreateUserDTO } from "./dtos";
import { User } from "./user";
import nodeMailer from "nodemailer";
// @ts-expect-error 公式の型情報がないので一旦無視する
import { stubTransport } from "nodemailer-stub";

const generateToken = (length: number) => {
  return randomBytes(length).toString("hex").substring(0, length);
};

const save = async (body: CreateUserDTO) => {
  // 必要なものだけを抽出する
  const { username, email, password } = body;

  const salt = 10;
  const hashed = await hash(password, salt);
  const user = {
    username,
    email,
    password: hashed,
    activationToken: generateToken(16),
  };
  await User.create(user);

  const transporter = nodeMailer.createTransport(stubTransport);
  await transporter.sendMail({
    from: "My App <info@my-app.com>",
    to: email,
    subject: "Account Activation",
    html: `Token is ${user.activationToken}`,
  });
};

const findByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export { save, findByEmail };
