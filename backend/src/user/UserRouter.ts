import express, { NextFunction, Request, Response } from "express";
import { CustomRequest, CreateUserDTO } from "./dtos";

import { save } from "./UserService";

const router = express.Router();

router.post(
  "/api/1.0/users",
  (req: Request, res: Response, next: NextFunction) => {
    const user = { ...req.body };
    if (user.username === null)
      return res.status(400).send({
        validationErrors: {
          username: "Username cannot be null",
        },
      });

    next();
  },
  async (req: CustomRequest<CreateUserDTO>, res) => {
    const user = { ...req.body };
    await save(user);

    return res.status(201).send({ message: "User Created" });
  }
);

export default router;
