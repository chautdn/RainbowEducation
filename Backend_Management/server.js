const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/database_config/mongo_config");
const UserRouter = require("./src/routes/userRoute");
const courseRoutes = require("./src/routes/courseRoutes");
const handleError = require("./src/utils/errorHandler");
const syllableRoute = require("./src/routes/syllableRoute");
const sentenceRoute = require("./src/routes/sentenceRoute");
const storyRoute = require("./src/routes/storyRoute");
const bodyPartsRoute = require("./src/routes/bodyPartsRoute");
const shapesRoute = require("./src/routes/shapesRoute");
const weatherRoute = require("./src/routes/weatherRoute");
require("dotenv").config({ path: "./config.env" });

const app = express(); //Create server

app.use(express.json());

//Cors setting (cho phép mọi origin để dễ test)
app.use(
  cors({
    origin: 'http://localhost:3000',
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
  next();
});

// --- Syllable Game API ---
app.use('/api', syllableRoute);

// --- Sentence Builder API ---
app.use('/api', sentenceRoute);

// --- Story Reader API ---
app.use('/api', storyRoute);

// --- Body Parts API ---
app.use('/api', bodyPartsRoute);

// --- Shapes Matching API ---
app.use('/api', shapesRoute);

// --- Weather Clothing API ---
app.use('/api', weatherRoute);

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
