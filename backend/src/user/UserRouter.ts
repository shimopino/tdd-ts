import express from "express";
import { CustomRequest, CreateUserDTO } from "./dtos";

import { save } from "./UserService";

const router = express.Router();

router.post(
  "/api/1.0/users",
  async (req: CustomRequest<CreateUserDTO>, res) => {
    const user = { ...req.body };
    if (user.username === null) return res.status(400).send();

    await save(user);

    return res.status(201).send({ message: "User Created" });
  }
);

export default router;
