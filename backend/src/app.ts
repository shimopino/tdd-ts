import express, { Request, Response } from "express";
import { hash } from "bcrypt";
import { User } from "./user/user";

const app = express();

app.use(express.json());

app.post("/api/1.0/users", (req: Request, res: Response) => {
  const salt = 10;

  hash(req.body.password, salt).then((hash) => {
    const user = {
      ...req.body,
      password: hash,
    };

    User.create(user).then(() => {
      return res.status(201).send({ message: "User Created" });
    });
  });
});

export { app };
