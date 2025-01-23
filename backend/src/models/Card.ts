import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Card extends Model {
  public id!: number;
  public name!: string;
  public type!: string;
  public image!: string;
  public description!: string;
  public userId!: number;
}

Card.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "cards",
    tableName: "cards",
  }
);

export default Card;
