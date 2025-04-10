const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");

const User = Sequelize.define(
  "user",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "unique_email", msg: "Email must be unique" },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    tableName: "user",
  }
);
module.exports = User;
