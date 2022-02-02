const { Router } = require("express");

const router = Router();

const {
  recipes,
  writeRecipesToFile,
  getAllRecipes,
  insertRecipe,
} = require("./db");

// returns all recipes
router.get("/", (req, res) => {
  const data = getAllRecipes();
  res.send(data);
});

// returns just 1 recipe
router.get("/:id", (req, res) => {
  const recipe = recipes.find((recipe) => recipe.id == req.params.id);
  if (!recipe) {
    return res.status(404).json({
      message: `${req.params.id} recipe not found`,
    });
  }
  res.send(recipe);
});

// adding a recipe
router.post("/", (req, res) => {
  const payload = req.body;
  if (!payload.name) {
    return res.status(400).send({ message: "Recipe should have a name" });
  }
  const newRecipe = insertRecipe(payload.name);
  writeRecipesToFile();
  return res.status(201).send(newRecipe);
});

// delete a recipe
router.delete("/:id", (req, res) => {
  const index = recipes.findIndex((recipe) => recipe.id == req.params.id);
  if (index == -1) {
    return res.status(404).json({
      message: `${req.params.id} recipe not found`,
    });
  }
  const deletedRecipe = recipes[index];
  recipes.splice(index, 1);
  res.send(deletedRecipe);
});

// update a recipe
router.put("/:id", (req, res) => {
  const payload = req.body;
  // req is ok?
  if (!payload.name) {
    return res.status(400).send({ message: "Recipe should have a name" });
  }
  // is the recipe to be changed there?
  const index = recipes.findIndex((recipe) => recipe.id == req.params.id);
  if (index == -1) {
    return res.status(404).json({
      message: `${req.params.id} recipe not found`,
    });
  }
  recipes[index]["name"] = payload.name;
  return res.send(recipes[index]);
});

module.exports = router;
