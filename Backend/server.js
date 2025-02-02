const express = require("express");
const app = express();
const cors = require("cors");
const instructorRoute = require("./routes/instructorRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const userRoutes = require("./routes/userRoutes");
const purchaseRoutes = require("./routes/coursePurchase");

const { dbConnect } = require("./utils/db");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

dbConnect();

// Use body-parser to parse raw JSON
app.use("/course", instructorRoute);
app.use("/lecture", lectureRoutes);
app.use("/user", userRoutes);
app.use("/api", purchaseRoutes);

app.listen(5000, () => {
  console.log("listening to port 5000");
});
