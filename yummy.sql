
-- yummy recipe table
CREATE TABLE recipes
(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name VARCHAR(256)
);

CREATE TABLE recipe_texts
(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  recipe INT,
  text TEXT,
  FOREIGN KEY (recipe) REFERENCES recipes(id)
);

INSERT INTO recipes
(id, name)
VALUES
(1, 'Chicken Curry'),
(2, 'Mutton Curry');

INSERT INTO recipe_texts
(id, recipe, text)
VALUES
(1, 1 ,'1. Get the chicken\n2.Wash the chicken\n3.Cook the chicken'),
(2, 2, '1. Get the goat\n2.Wash the goat\n3.Cook the goat');

SELECT recipes.id, recipes.name, recipe_texts.text
FROM
recipes
INNER JOIN recipe_texts
ON recipes.id = recipe_texts.recipe
WHERE recipes.id = 2;


DELETE FROM
recipe_texts
WHERE recipe = 2;

DELETE FROM
recipes
WHERE id = 2;