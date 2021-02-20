// Create a router for this module
const express = require("express");
const router = express.Router();

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

router.get("/", (req, res) => {
  res.send(cuisines);
});

// Using route params
router.get("/:cuisine", (req, res) => {
  const cuisine = cuisines.find((c) => c.cuisine === req.params.cuisine);
  if (!cuisine)
    return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);
  res.send(cuisine);
});

// Basic POST request
router.post("/", (req, res) => {
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
router.put("/:cuisine", (req, res) => {
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
router.delete("/:cuisine", (req, res) => {
  const cuisine = cuisines.find((c) => c.cuisine === req.params.cuisine);
  if (!cuisine)
    return res.status(404).send(`No cuisine with name ${req.params.cuisine}`);

  const index = cuisines.indexOf(cuisine);
  cuisines.splice(index, 1);

  res.send(cuisine);
});

module.exports = router;
