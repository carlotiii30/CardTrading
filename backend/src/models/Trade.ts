import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./User";
import Card from "./Card";

class Trade extends Model {
  public id!: number;
  public offeredCardId!: number;
  public requestedCardId!: number;
  public offeredUserId!: number;
  public requestedUserId!: number;
  public status!: string;
}

Trade.init(
  {
    offeredCardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedCardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offeredUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Trade",
  }
);

export default Trade;