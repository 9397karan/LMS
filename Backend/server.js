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
    origin: "https://lms-front-tl73.onrender.com",
    credentials: true,
  })
);

dbConnect();
app.get('/',(req,res)=>{
  res.json({message:'Backened Running'})
})
// Use body-parser to parse raw JSON
app.use("/course", instructorRoute);
app.use("/lecture", lectureRoutes);
app.use("/user", userRoutes);
app.use("/api", purchaseRoutes);

app.listen(5000, () => {
  console.log("listening to port 5000");
});
