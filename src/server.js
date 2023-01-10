const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.status(200).json({ message: "ehlo werld!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}\n---------------------------`);
});
