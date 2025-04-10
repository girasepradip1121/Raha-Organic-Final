const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Image = sequelize.define(
  "image",
  {
    imageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "product",
        key: "productId",
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "image", timestamps: true }
);

module.exports = Image;
