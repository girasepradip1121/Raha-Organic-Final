// controllers/razorpayController.js
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});``

const createRazorpayOrder = async (req, res) => {
  const { totalPrice } = req.body;
  const amount = parseInt(totalPrice * 100); // convert to paisa

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, message: "Razorpay order creation failed" });
  }
};

module.exports={createRazorpayOrder}