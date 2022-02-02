const express = require("express");
const app = express();
const PORT = 8080;

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server 🏃‍♀️🏃‍♀️🏃‍♀️ on port ${PORT}`);
});
