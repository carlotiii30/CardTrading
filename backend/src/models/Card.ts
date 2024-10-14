import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./User";

class Card extends Model {
  public id!: number;
  public name!: string;
  public rarity!: string;
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
    rarity: {
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
    modelName: "Card",
  }
);

export default Card;
