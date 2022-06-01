import { hash } from "bcrypt";
import { CreateUserDTO } from "./dtos";
import { User } from "./user";

const save = async (body: CreateUserDTO) => {
  // 必要なものだけを抽出する
  const { username, email, password } = body;

  const salt = 10;
  const hashed = await hash(password, salt);
  const user = {
    username,
    email,
    password: hashed,
  };
  await User.create(user);
};

const findByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export { save, findByEmail };
