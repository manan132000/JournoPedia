require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const { connectDB } = require("./src/config/db");
const { router } = require("./src/routes/routes");
var cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

connectDB();

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
