const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/database_config/mongo_config");
const UserRouter = require("./src/routes/userRoute");
const courseRoutes = require("./src/routes/courseRoutes");
const handleError = require("./src/utils/errorHandler");
require("dotenv").config({ path: "./config.env" });

const app = express(); //Create server

app.use(express.json());

//Cors setting
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

//Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//Middleware Routing
app.use("/user", UserRouter);
app.use("/course", courseRoutes);
////Error Handler Middleware
app.use(handleError);

//Connect Mongo Config
connectDB();

//Listen Server
app.listen(process.env.PORT || 8080, () =>
  console.log("Server is running at ", process.env.PORT || 8080)
);
