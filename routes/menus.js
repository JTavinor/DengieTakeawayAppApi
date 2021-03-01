// Create a router for this module
const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Validation functions
function validateMenu(menu) {
  const item = Joi.object().keys({
    itemName: Joi.string(),
    itemDescription: Joi.string(),
    itemPrice: Joi.number(),
  });

  const subMenu = Joi.object().keys({
    category: Joi.string(),
    description: Joi.string(),
    items: Joi.array().items(item),
  });

  const schema = Joi.object().keys({
    restaurant: Joi.string(),
    menu: Joi.array().items(subMenu),
  });

  return schema.validate(menu);
}

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemPrice: { type: Number },
});

const menuSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  items: [itemSchema],
});

const restaurantMenuSchema = new mongoose.Schema({
  restaurant: { type: String, required: true },
  menu: [menuSchema],
});

const Menu = new mongoose.model("Menu", restaurantMenuSchema);

// Get a list of all menus
router.get("/", async (req, res) => {
  const menus = await Menu.find();
  res.send(menus);
});

router.get("/:id", async (req, res) => {
  try {
    var menu = await Menu.findById(req.params.id);
    res.send(menu);
  } catch {
    if (!menu) return res.status(404).send(`No menu with id ${req.params.id}`);
  }
});

// Add a new menu to the db
router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validateMenu(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    menu = await Menu.create(req.body);
  } catch (ex) {
    res.status(400).send(ex.errors);
  }

  res.send(menu);
});

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
exports.Menu = Menu;

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
