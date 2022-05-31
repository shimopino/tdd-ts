import { hash } from "bcrypt";
import { CreateUserDTO } from "./dtos";
import { User } from "./user";

const save = async (body: CreateUserDTO) => {
  const salt = 10;
  const hashed = await hash(body.password, salt);
  const user = { ...body, password: hashed };
  await User.create(user);
};

const findByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export { save, findByEmail };
