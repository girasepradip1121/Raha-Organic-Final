const User = require("../Models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.userId || null, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
};

const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    if (!fullName || !userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password should required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Email already exists");
      return res.status(500).json({ message: "Email Already Exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      userName,
      email,
      password: hashPassword,
    });
    res.status(200).json(newUser);
    console.log("User Created");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    console.log("user", user);

    if (!user) {
      return res.status(401).json({ message: "User Not Registered..." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    const userData = {
      ...user.dataValues,
      token: token,
    };

    await User.update(
      {
        token: token,
      },
      { where: { userId: user.userId } }
    );

    res.status(200).json({ message: "Login Successful", user: userData });
    console.log("Login Successful", token);
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged Out Successful" });
    console.log("Loggged Out...");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users data" });
  }
};

module.exports = { signup, login, logout, getUsers };
