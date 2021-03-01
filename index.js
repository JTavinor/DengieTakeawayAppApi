// Sets up a debugger for the startup file
// To only use a certain debugger, set the DEBUG env var:
// export DEBUG=app:startup
const startupDebugger = require("debug")("app:startup");
// Sets up a debugger for databases (NOTE: Name is arbitrary)
// To set up multiple debugger:
// export DEBUG=app:startup,app:db
const dbDebugger = require("debug")("app:db");

const cors = require("cors");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const logger = require("./middleware/logger");
const cuisines = require("./routes/cuisines");
const menus = require("./routes/menus");

// Create express instance
const express = require("express");
const app = express();

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
// app_password is set as an environment variable. Set it using export app_password=XXXX.
//  Use for secret variables. Access it in the custom-environment-variables config file
console.log("Mail Password: " + config.get("mail.password"));

process.env.NODE_ENV;

app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());
// Look into Helmet - for securing headers
app.use(helmet());
// Look into Morgan - For logging
// Enabling morgan only if we are in development environment
// set environment in terminal using: export NODE_ENV=`enviroment here`
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled");
  dbDebugger("DEbugging... enabled");
}

//Custom middleware
app.use(logger);
// Adding the cuisines router
app.use("/api/cuisines", cuisines);
app.use("/api/menus", menus);

// Basic GET request
// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// Using envirnoment variable to listen
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const mongoose = require("mongoose");

// Connect to mongodb database
mongoose
  .connect(config.get("dbConnectionString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Schema for a customer order
//Need to add address
const orderSchema = new mongoose.Schema({
  items: {
    type: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "Order must contain at least one item",
    },
    required: true,
  },
  delivery: { type: Boolean, required: true },
  phoneNumber: { type: String, required: true },
  customerName: { type: String, required: true, maxLength: 30 },
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
    delivery: true,
    // phoneNumber: "123",
    // customerName: "James Blake",
  });

  try {
    const result = await order.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
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

async function removeOrder(id) {
  const result = await Order.deleteOne({ _id: id });
  console.log(result);
}

// createOrder();
