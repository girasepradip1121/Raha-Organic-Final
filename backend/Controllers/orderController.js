const Order = require("../Models/orderModel");
const OrderItem = require("../Models/orderItemModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const Image = require("../Models/imageModel");

const createOrder = async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body);

    const {
      userId,
      shippingCharge,
      tax,
      totalPrice,
      paymentMethod,
      formData,
      status,
      orderItems,
    } = req.body;

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      apt,
      city,
      state,
      postalCode,
    } = formData || {};
    console.log("Final Extracted Data:", { firstName, email, phone, address });
    if (
      !userId==null ||
      !tax ==null||
      !totalPrice==null ||
      !paymentMethod==null||
      !phone==null||
      !email==null||
      !status==null
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const order = await Order.create({
      userId,
      shippingCharge,
      tax,
      totalPrice,
      paymentMethod,
      firstName,
      lastName,
      email,
      phone,
      address,
      apt,
      city,
      state,
      postalCode,
      status,
    });
    const createdOrderItems = await Promise.all(
      orderItems?.map(async (item) => {
        console.log("Creating Order Item:", item);
        return await OrderItem.create({
          orderId: order.orderId,
          productId: item.productId,
          quantity: item.quantity,
          // size: item.size,
          price: item.price,
          totalAmount: item.quantity * item.price,
        });
      })
    );
    await Cart.destroy({ where: { userId } });

    return res.status(201).json({
      message: "Order placed successfully!",
      order,
      orderItems: createdOrderItems,
    });
  } catch (error) {
    console.log("Error in Order Creation:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
    console.log("order Found...");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          attributes: ["quantity", "price", "totalAmount"],
          include: [
            {
              model: Product,
              attributes: ["name", "price", "size"],
              include: [{ model: Image, attributes: ["imageUrl"] }],
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error fetching orders:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name", "price", "size"],
              include: [
                {
                  model: Image,
                  attributes: ["imageUrl"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log(orders);

    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error fetching user orders:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  console.log("body", req.body);

  try {
    await Order.update({ status }, { where: { orderId } });
    const updatedOrder = await Order.findOne({
      where: { orderId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [{ model: Image }],
            },
          ],
        },
      ],
    });

    res.status(200).send({
      message: "Order Status Updated Successfully",
      order: updatedOrder,
    });
    console.log("updatedOrder", orderId, updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating order status" });
  }
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.destroy({ where: { orderId } });
    res.status(200).json({ message: "Order deleted successfully" });
    console.log("order deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 1) {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled." });
    }

    order.status = 5;
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
};
