// Sets up a debugger for the startup file
// To only use a certain debugger, set the DEBUG env var:
// export DEBUG=app:startup
const startupDebugger = require("debug")("app:startup");
// Sets up a debugger for databases (NOTE: Name is arbitrary)
// To set up multiple debugger:
// export DEBUG=app:startup,app:db
const dbDebugger = require("debug")("app:db");

const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const logger = require("./middleware/logger");

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

const cuisines = [
  {
    cuisine: "italian",
    bannerImage: "",
    restaurants: [
      { restaurant: "Mellows", open: "14:00-21:00", start: 10, close: 21 },
      { restaurant: "Pizza Island", open: "09:00-12:00", start: 9, close: 14 },
      { restaurant: "WAWA", open: "17:00-23:00", start: 5, close: 23 },
    ],
  },
  {
    cuisine: "indian",
    bannerImage: "",
    restaurants: [
      { restaurant: "Curry Cottage", open: "19:00-01:00", start: 5, close: 1 },
      { restaurant: "Polash", open: "14:00-21:00", start: 5, close: 21 },
    ],
  },
  {
    cuisine: "chinese",
    bannerImage: "",
    restaurants: [
      {
        restaurant: "Oriental House",
        open: "14:00-21:00",
        start: 5,
        close: 21,
      },
      { restaurant: "Rickshaw", open: "14:00-21:00", start: 5, close: 21 },
    ],
  },
];

// Basic GET request
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/api/cuisines", (req, res) => {
  res.send(cuisines);
});

// Using route params
app.get("/api/cuisines/:cuisine", (req, res) => {
  const cuisine = cuisines.find((c) => c.cuisine === req.params.cuisine);
  if (!cuisine)
    return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);
  res.send(cuisine);
});

// Basic POST request
app.post("/api/cuisines", (req, res) => {
  const { error } = validateCuisine(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const cuisine = {
    cuisine: req.body.cuisine,
    bannerImage: "",
    restaurants: [],
  };

  cuisines.push(cuisine);

  res.send(cuisine);
});

// Basic PUT request
app.put("/api/cuisines/:cuisine", (req, res) => {
  const cuisine = cuisines.find((c) => c.cuisine === req.params.cuisine);
  if (!cuisine)
    return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);

  const { error } = validateCuisine(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  cuisine.cuisine = req.body.cuisine;

  res.status(200).send(cuisine);
});

function validateCuisine(cuisine) {
  const schema = Joi.object({
    cuisine: Joi.string().min(3).required(),
  });

  return schema.validate(cuisine);
}

// Basic DELETE request
app.delete("/api/cuisines/:cuisine", (req, res) => {
  const cuisine = cuisines.find((c) => c.cuisine === req.params.cuisine);
  if (!cuisine)
    return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);

  const index = cuisines.indexOf(cuisine);
  cuisines.splice(index, 1);

  res.send(cuisine);
});

// Using envirnoment variable to listen
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
