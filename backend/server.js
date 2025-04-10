const express = require("express");
const app = express();
const sequelize = require("./config/db");
const cors = require("cors");

const index = require("./Models/index");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

//import all routes
const userRoutes = require("./Routes/userRoutes");
const productRoutes=require("./Routes/productRoutes")
const categoryRoutes=require("./Routes/categoryRoutes")
const cartRoutes=require("./Routes/cartRoutes")
const orderRoutes=require("./Routes/orderRoutes")
const contactRoutes=require("./Routes/contactUsRoutes")
const reviewRoutes = require("./Routes/reviewRoutes");

//routes ke use
app.use("/user", userRoutes);
app.use("/product",productRoutes);
app.use("/category",categoryRoutes);
app.use("/cart",cartRoutes);
app.use("/order",orderRoutes);
app.use("/contact",contactRoutes)
app.use("/review", reviewRoutes);



app.get("/", (req, res) => {
  res.send("Hello, welcome to MDM Lights");
});

sequelize
  .sync({alter:true}) //alter:true use krna badme
  .then(() => {
    console.log("Database synced successfully...");
  })
  .catch((err) => {
    console.log("Error syncing database:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
