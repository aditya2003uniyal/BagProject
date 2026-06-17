require("dotenv").config();

const express = require("express");
const app = express();

const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const path = require("path");

// Database
require("./config/mongoose-connection");

// Routers
const ownersRouter = require("./routes/ownerRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash());

// Global variables for EJS
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.cookies.token;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");

// Home Page
app.get("/", (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/users/shop");
    }

    res.render("index");
});

// Routes
app.use("/users", usersRouter);
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);

// Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});