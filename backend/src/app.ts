import express, { Request, Response } from "express";
import { User } from "./user/user";

const app = express();

app.post("/api/1.0/users", (req: Request, res: Response) => {
  User.create(req.body).then(() => {
    return res.status(201).send({ message: "User Created" });
  });
});

export { app };
