const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const restaurantAddressSchema = new mongoose.Schema({
  address1: { type: String, required: true },
  town: { type: String, required: true },
  postcode: { type: String, required: true },
});

const customerDetailsSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, required: true },
  address1: { type: String },
  address2: { type: String },
  town: { type: String },
  postcode: { type: String },
});

// Schema for a customer order
//Need to add address
const orderSchema = new mongoose.Schema({
  basket: [itemSchema],
  restaurant: { type: String, required: true },
  restaurantAddress: restaurantAddressSchema,
  subTotal: { type: Number, required: true },
  deliveryOption: { type: String, required: true },
  customerDetails: customerDetailsSchema,
  paymentOption: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

router.post("/", async (req, res) => {
  let order = new Order({
    basket: req.body.basket,
    restaurant: req.body.restaurant,
    restaurantAddress: req.body.restaurantAddress,
    subTotal: req.body.subTotal,
    deliveryOption: req.body.deliveryOption,
    customerDetails: req.body.customerDetails,
    paymentOption: req.body.paymentOption,
  });

  console.log(req.body);

  try {
    order = await order.save();
  } catch (ex) {
    res.status(400).send(ex.errors);
  }

  res.send(order);
});

// async function getOrders() {
//   // Finds all documents with these info
//   const orders = await Order.find({
//     customerName: "Kenny Smith",
//     orderComplete: true,
//   })
//     // Limit num of docs returned
//     .limit(10)
//     // Sort the data: 1 = ascending, -1 = descending
//     .sort({ customerName: 1 })
//     // Select specific properties to be returned
//     .select({ items: 1, customerName: 1 });
//   console.log(orders);
// }

// async function updateOrder(id) {
//   // Query first approach
//   const order = await Order.findById(id);
//   if (!order) return;
//   order.orderComplete = true;

//   const result = await order.save();
//   console.log(result);
// }

// async function removeOrder(id) {
//   const result = await Order.deleteOne({ _id: id });
//   console.log(result);
// }

// createOrder();
module.exports = router;
