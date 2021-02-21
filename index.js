const mongoose = require("mongoose");
const config = require("config");

// Connect to mongodb database
mongoose
  .connect(config.get("dbConnectionString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Schema for a customer order
const orderSchema = new mongoose.Schema({
  items: [{ itemName: String, quantity: Number, price: Number }],
  delivery: Boolean,
  phoneNumber: String,
  customerName: String,
  orderTime: { type: Date, default: Date.now() },
  orderComplete: { type: Boolean, default: false },
});

const Order = mongoose.model("Order", orderSchema);

async function createOrder() {
  const order = new Order({
    items: [
      { itemName: "Coke", quantity: 1, price: 3 },
      { itemName: "Pilau Rice", quantity: 3, price: 5 },
      { itemName: "Sag Ponir", quantity: 4, price: 7.5 },
    ],
    delivery: false,
    phoneNumber: "0745275673",
    customerName: "Kenny Smith",
  });

  const result = await order.save();
  console.log(result);
}

async function getOrders() {
  // Finds all documents with these info
  const orders = await Order.find({
    customerName: "Kenny Smith",
    orderComplete: true,
  })
    // Limit num of docs returned
    .limit(10)
    // Sort the data: 1 = ascending, -1 = descending
    .sort({ customerName: 1 })
    // Select specific properties to be returned
    .select({ items: 1, customerName: 1 });
  console.log(orders);
}

async function updateOrder(id) {
  // Query first approach
  const order = await Order.findById(id);
  if (!order) return;
  order.orderComplete = true;

  const result = await order.save();
  console.log(result);
}

updateOrder("603171371804edbf5afeb24f");
