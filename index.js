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

createOrder();
