const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const https = require("https");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT | 5100;

const app = express();
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        genid: (req) => {
            return uuidv4();
        },
        secret: process.env.JWT_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV != "development" },
    })
);

app.enable("trust proxy");
app.set("view engine", "ejs");
app.use(morgan("dev"));

// API Calls
app.use("/api", require("./middleware/api.js"));

app.use("/", require("./middleware/checkCookies.js"));

// route to admin pages
app.use("/admin", require("./routes/adminRouting.js"));

// route to requested page
app.use("/", require("./routes/routing.js"));

app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}...`);
});
