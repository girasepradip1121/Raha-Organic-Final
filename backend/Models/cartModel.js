const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const Cart = Sequelize.define(
  "cart",
  {
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "user",
        key: "userId",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      references: {
        model: "product",
        key: "productId",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cart",
    timestamps: true,
  }
);

module.exports = Cart;
