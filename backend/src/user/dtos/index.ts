import { Request } from "express";
import { CreateUserDTO } from "./CreateUserDTO";

interface CustomRequest<T> extends Request {
  body: T;
}

export { CustomRequest, CreateUserDTO };
