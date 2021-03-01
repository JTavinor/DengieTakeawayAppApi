// Create a router for this module
const { Menu } = require("./menus");
const Joi = require("joi");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Validation functions
function validateCuisine(cuisine) {
  const schema = Joi.object({
    cuisine: Joi.string().min(3).required(),
    restaurants: Joi.array(),
  });

  return schema.validate(cuisine);
}

function validateRestaurant(restaurant) {
  const schema = Joi.object({
    restaurant: Joi.string().min(3).required(),
    openingHours: Joi.array().required(),
    postcodes: Joi.array().required(),
  });

  return schema.validate(restaurant);
}

const cuisineSchema = new mongoose.Schema({
  restaurants: {
    type: [
      {
        restaurant: { type: String, required: true },
        openingHours: { type: [{ type: Number, required: true }] },
        postcodes: { type: [{ type: String, required: true }] },
      },
    ],
    validate: {
      validator: function (v) {
        return v && v.length >= 0;
      },
      message: "Restaurants must contain at least one restaurant",
    },
    required: true,
  },
  cuisine: { type: String, required: true },
  bannerImage: { type: String },
});

const Cuisine = new mongoose.model("Cuisine", cuisineSchema);

// Get a list of all cuisines
router.get("/", async (req, res) => {
  const cuisines = await Cuisine.find();
  res.send(cuisines);
});

// Add a new cuisine to the db
router.post("/", upload.single("bannerImage"), async (req, res) => {
  // const menu = await Menu;

  const { error } = validateCuisine(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let cuisine = new Cuisine({
    cuisine: req.body.cuisine,
    bannerImage: req.file.path,
    restaurants: req.body.restaurants,
  });

  try {
    cuisine = await cuisine.save();
  } catch (ex) {
    res.status(400).send(ex.errors);
  }

  res.send(cuisine);
});

// router.post("/", async (req, res) => {
//   const user = (await User.findById(req.body.userId)) || {
//     _id: null,
//     userName: null,
//     password: null,
//   };

//   const leaderboard = new Leaderboard({
//     user: {
//       _id: user._id,
//       userName: user.userName,
//       password: user.password,
//     },
//     name: req.body.name || user.userName,
//     score: req.body.score,
//     date: moment().locale("en-gb").format("L"),
//   });

//   const result = await leaderboard.save();
//   res.send(result);
// });

// Add a new restaurant to a cuisine
router.put("/:cuisine", async (req, res) => {
  const { error } = validateRestaurant(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const cuisine = await Cuisine.findOne({ cuisine: req.params.cuisine });

  if (!cuisine)
    return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);

  if (!cuisine.restaurants) {
    cuisine.restaurants = [];
  }

  cuisine.restaurants.push({
    restaurant: req.body.restaurant,
    openingHours: req.body.openingHours,
    postcodes: req.body.postcodes,
  });

  const result = await cuisine.save();

  res.status(200).send(result);
});

module.exports = router;

// TO DO
// Using route params
// router.get("/:cuisine", (req, res) => {
//   const cuisine = cuisines.find((c) => c.cuisine === req.params.cuisine);
//   if (!cuisine)
//     return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);
//   res.send(cuisine);
// });

// Delete a cuisine
// router.delete("/:cuisine", async (req, res) => {
//   const cuisine = await Cuisine.deleteOne({ cuisine: req.params.cuisine });

//   if (!cuisine)
//     return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);

//   res.send(cuisine);
// });
