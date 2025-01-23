import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Trade",
    tableName: "trades",
  }
);

export default Trade;
