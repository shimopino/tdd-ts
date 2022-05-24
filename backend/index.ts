import express from "express";

const app = express();
const port = process.env.PORT ? process.env.PORT : 3010;

app.listen(port, () => {
  console.log("hi dev");
});

export { app };
