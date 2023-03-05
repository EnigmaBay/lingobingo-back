const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

require("dotenv").config();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(200).json({ message: "ehlo werld!" });
});

const apiv1 = require("./api/v1/apiv1");
app.use("/api/v1", apiv1);

app.all("*", (req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ message: "Nothing here, padawan." });
  }
});

// error handler middleware defined after last app.use and route calls
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    console.log(
      "custom error handler detected headers already sent so delegating to Express default error handler."
    );
    return next(err);
  } else {
    let errMsg;
    if (!err) {
      errMsg = "Custom error handler return.";
    } else {
      errMsg = err.message;
    }

    let statusCode = 400;

    if (res.locals.statusCode !== undefined){
      statusCode = res.locals.statusCode;
    }

    res.status(statusCode).json({ message: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}\n---------------------------`);
});
``