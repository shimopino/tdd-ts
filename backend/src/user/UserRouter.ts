import { hash } from "bcrypt";
import express from "express";
import { User } from "./user";

const router = express.Router();

router.post("/api/1.0/users", async (req, res) => {
  const salt = 10;
  const hashed = await hash(req.body.password, salt);
  const user = { ...req.body, password: hashed };
  await User.create(user);

  return res.status(201).send({ message: "User Created" });
});

export default router;
