import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {}

User.init(
  {
    username: {
      type: new DataTypes.STRING(),
    },
    email: {
      type: new DataTypes.STRING(),
    },
    password: {
      type: new DataTypes.STRING(),
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

export { User };
