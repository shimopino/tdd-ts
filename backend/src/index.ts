import { app } from "./app";

const port = process.env.PORT ? process.env.PORT : 3010;

app.listen(port, () => {
  console.log("hi dev");
});
