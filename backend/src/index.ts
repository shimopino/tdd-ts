import { app } from "./app";
import { sequelize } from "./config/database";

const port = process.env.PORT ? process.env.PORT : 3010;

sequelize.sync({ force: true });

app.listen(port, () => {
  console.log("hi dev");
});
