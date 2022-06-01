import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare inactive: boolean;
}

User.init(
  {
    username: {
      type: new DataTypes.STRING(),
    },
    email: {
      type: new DataTypes.STRING(),
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(),
    },
    inactive: {
      type: new DataTypes.BOOLEAN(),
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

export { User };
