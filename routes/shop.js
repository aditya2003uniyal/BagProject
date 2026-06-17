const express = require("express");
const router = express.Router();

const isLogin = require("../middleware/isLogin");
const usermodel = require("../models/usermodel");
const productModel = require("../models/productmodel"); // IMPORTANT: assume you have this

// 🛒 SHOP PAGE
router.get("/shop", isLogin, async (req, res) => {
    try {

        let filter = {};

        // NEW COLLECTION
        if (req.query.new) {
            filter.createdAt = { $exists: true };
        }

        // DISCOUNTED PRODUCTS
        if (req.query.discount) {
            filter.discout = { $gt: 0 };
        }

        const products = await productModel.find(filter);

        res.render("shop", { products });

    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});


// ➕ ADD TO CART
router.get("/addtocart/:id", isLogin, async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.user.email });

        user.cart.push(req.params.id);
        await user.save();

        req.flash("message", "Product added to cart successfully ✅");

        return res.redirect("/shop");

    } catch (err) {
        console.log(err);
        res.send("Error adding to cart");
    }
});

module.exports = router;