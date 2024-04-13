require("dotenv").config();

require("./config/db");

const express = require("express");
const app = express();

//* json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* cors
const cors = require("cors");
app.use(cors());

//* routes
app.use("/users", require("./routes/users"));

//* 404
app.use("*", (req, res) => {
  res.status(404).json({ message: `آدرس ${req.baseUrl} پیدا نشد` });
});

//* handle error
const { handleError } = require("./middlewares/handleError");
app.use(handleError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
