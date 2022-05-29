import express from "express";
import { CustomRequest, CreateUserDTO } from "./dtos";

import { save } from "./UserService";

const router = express.Router();

router.post(
  "/api/1.0/users",
  async (req: CustomRequest<CreateUserDTO>, res) => {
    await save(req.body);

    return res.status(201).send({ message: "User Created" });
  }
);

export default router;
