const express = require("express");
const router = express.Router();

const isLogin = require("../middleware/isLogin");
const product = require("../models/product");
const usermodel = require("../models/usermodel");

// ======================
// HOME
// ======================

console.log("USERS ROUTER LOADED");
router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error, loginUser: false });
});

// ======================
// SHOP
// ======================
router.get("/shop", isLogin, async (req, res) => {
    try {
        const products = await product.find();
        res.render("shop", { products });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading shop");
    }
});

// ======================
// LOGOUT
// ======================
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// ======================
// ADD TO CART
// ======================

router.get("/addtocart/:id", isLogin, async (req, res) => {
    console.log("====== ROUTE HIT ======");
    console.log("Product ID:", req.params.id);
    console.log("User:", req.user);

    res.send("Add to cart route working");
});
module.exports = router;