const db = require("better-sqlite3")("yummy.db", { fileMustExist: true });
const { Router } = require("express");

const router = Router();

// returns all recipes
router.get("/", (req, res) => {
  const recipes = db.prepare("SELECT id, name FROM recipes;").all();
  res.send(recipes);
});

// returns just 1 recipe
router.get("/:id", (req, res) => {
  const recipe = db
    .prepare(
      `SELECT recipes.id, recipes.name, recipe_texts.text recipe_text
    FROM
    recipes
    INNER JOIN recipe_texts
    ON recipes.id = recipe_texts.recipe
    WHERE recipes.id = ?;`
    )
    .get(req.params.id);
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
  if (!payload.name || !payload.text) {
    return res
      .status(400)
      .send({ message: "Recipe should have a name and a text" });
  }
  const newRecipe = db
    .prepare(
      `INSERT INTO recipes
  (name)
  VALUES
  (@name);`
    )
    .run({ name: payload.name });

  const newRecipeId = newRecipe.lastInsertRowid;
  const newRecipeText = db
    .prepare(
      `INSERT INTO recipe_texts
  (recipe, text)
  VALUES
  (@newRecipeId ,@text);`
    )
    .run({
      newRecipeId: newRecipeId,
      text: payload.text,
    });

  return res.status(201).send({
    id: newRecipeId,
    name: payload.name,
    text: payload.text,
  });
});

// delete a recipe
router.delete("/:id", (req, res) => {
  // check if the recipe is present in table
  const recipe = db
    .prepare(
      `SELECT recipes.id, recipes.name
    FROM
    recipes
    WHERE recipes.id = ?;`
    )
    .get(req.params.id);
  if (!recipe) {
    return res.status(404).json({
      message: `${req.params.id} recipe not found`,
    });
  }

  // remove the recipe text first
  db.prepare(
    `DELETE FROM recipe_texts
      WHERE recipe = @recipeId;`
  ).run({ recipeId: req.params.id });

  // remove recipe
  db.prepare(
    `DELETE FROM recipes
      WHERE id = @recipeId;`
  ).run({ recipeId: req.params.id });

  res.send(recipe);
});

// update a recipe
router.put("/:id", (req, res) => {
  const payload = req.body;
  // req is ok?
  if (!payload.name || !payload.text) {
    return res
      .status(400)
      .send({ message: "Recipe should have a name and text" });
  }

  // find the recipe to update
  const recipe = db
    .prepare(
      `SELECT recipes.id, recipes.name
    FROM
    recipes
    WHERE recipes.id = ?;`
    )
    .get(req.params.id);
  if (!recipe) {
    return res.status(404).json({
      message: `${req.params.id} recipe not found`,
    });
  }

  db.prepare(
    `UPDATE recipes
    SET name=@name
    WHERE id = @recipeId;`
  ).run({ recipeId: req.params.id, name: payload.name });

  db.prepare(
    `UPDATE recipe_texts
    SET text=@text
    WHERE recipe = @recipeId;`
  ).run({ recipeId: req.params.id, text: payload.text });

  return res.send({
    id: recipe.id,
    name: payload.name,
    text: payload.text,
  });
});

module.exports = router;
