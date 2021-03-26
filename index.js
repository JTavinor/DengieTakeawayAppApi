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
const orders = require("./routes/orders");

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
app.use("/api/orders", orders);

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
