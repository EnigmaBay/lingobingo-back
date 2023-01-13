const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

require("dotenv").config();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "ehlo werld!" });
});

const apiv1 = require('./api/v1/apiv1');
app.use('/api/v1', apiv1);

app.all("*", (req, res) =>{
  res.status(404).json({ message: 'Nothing here, padawan.' });
});

// error handler middleware defined after last app.use and route calls
app.use((err, req, res, next)=>{
  if(res.headersSent) {
    console.log('custom error handler detected headers already sent.');
    return next(err);
  }
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred.'});
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}\n---------------------------`);
});
