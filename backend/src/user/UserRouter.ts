import express, { NextFunction, Request, Response } from "express";
import { CustomRequest, CreateUserDTO } from "./dtos";

import { save } from "./UserService";

const router = express.Router();

const validateUsername = (req: Request, res: Response, next: NextFunction) => {
  const user = { ...req.body };
  if (user.username === null) {
    // @ts-expect-error 一旦型付けを無視する
    req.validationErrors = {
      username: "Username cannot be null",
    };
  }
  next();
};

const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const user = { ...req.body };
  if (user.email === null) {
    // @ts-expect-error 一旦型付けを無視する
    req.validationErrors = {
      // @ts-expect-error 一旦型付けを無視する
      ...req.validationErrors,
      email: "Email cannot be null",
    };
  }

  next();
};

router.post(
  "/api/1.0/users",
  validateUsername,
  validateEmail,
  async (req: CustomRequest<CreateUserDTO>, res) => {
    if (req.validationErrors) {
      const response = { validationErrors: { ...req.validationErrors } };
      return res.status(400).send(response);
    }

    const user = { ...req.body };
    await save(user);

    return res.status(201).send({ message: "User Created" });
  }
);

export default router;
