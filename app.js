const express = require("express");
const app = express();
const PORT = 8080;

const { loadRecipesFromFile, writeRecipesToFile } = require("./db");
const recipeRoutes = require("./recipe.route");

loadRecipesFromFile();

app.use(express.json());

// specifying routes
app.use("/recipes", recipeRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    message: "Resource not found",
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server 🏃‍♀️🏃‍♀️🏃‍♀️ on port ${PORT}`);
});
