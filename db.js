const fs = require("fs");

const filePath = "recipes.data.json";
let recipes = [];

const writeRecipesToFile = () => {
  fs.writeFileSync(filePath, JSON.stringify(recipes));
};

const loadRecipesFromFile = () => {
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  recipes = JSON.parse(data);
};

const getAllRecipes = () => {
  return recipes;
};

const findRecipe = (id) => {
  const index = recipes.findIndex((recipe) => recipe.id == id);
  if (index == -1) {
    return null;
  }
  return recipes[index];
};

const insertRecipe = (recipeName) => {
  const newRecipe = {
    id: new Date().getTime(),
    name: recipeName,
  };
  recipes.push(newRecipe);
  return newRecipe;
};

module.exports = {
  recipes,
  writeRecipesToFile,
  loadRecipesFromFile,

  // utility functions
  getAllRecipes,
  findRecipe,
  insertRecipe,
};
