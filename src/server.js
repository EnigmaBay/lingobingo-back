const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "ehlo werld!" });
});

const apiv1 = require('./api/v1/apiv1');
app.use('/api/v1', apiv1);

app.all("*", (req, res) =>{
  res.status(404).json({ message: 'Nothing here, padawan.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}\n---------------------------`);
});
