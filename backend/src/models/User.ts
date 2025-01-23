import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;
