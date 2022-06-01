import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import { CreateUserDTO } from "./dtos";
import { User } from "./user";
import { sendAccountActivation } from "../email/EmailService";

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

  await sendAccountActivation(email, user.activationToken);
};

const findByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export { save, findByEmail };
