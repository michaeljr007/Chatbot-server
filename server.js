require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const routes = require("./routes/main");

// Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Middleware
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//Dummy test route
app.get("/", (req, res) => {
  res.send("Chatbot api");
});

// Routes
app.use("/", routes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening at port: ${port}`));
