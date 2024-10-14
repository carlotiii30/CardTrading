import User from "./User";
import Card from "./Card";
import Trade from "./Trade";

User.hasMany(Trade, { as: "offeredTrades", foreignKey: "offeredUserId" });
User.hasMany(Trade, { as: "requestedTrades", foreignKey: "requestedUserId" });
Card.belongsTo(User, { foreignKey: "userId" });
Trade.belongsTo(User, { as: "offeredUser", foreignKey: "offeredUserId" });
Trade.belongsTo(User, { as: "requestedUser", foreignKey: "requestedUserId" });
Trade.belongsTo(Card, { as: "offeredCard", foreignKey: "offeredCardId" });
Trade.belongsTo(Card, { as: "requestedCard", foreignKey: "requestedCardId" });

export { User, Card, Trade };
