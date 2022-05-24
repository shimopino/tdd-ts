import express, { Request, Response } from "express";

const app = express();

app.post("/api/1.0/users", (req: Request, res: Response) => {
  return res.status(201).send({ message: "User Created" });
});

export { app };
