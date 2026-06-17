const express = require("express");
const router = express.Router();

const User = require("../models/usermodel");

// Add product to cart
router.post("/add/:id", async (req, res) => {

    const productId = req.params.id;

    // TEMPORARY USER ID FOR TESTING
    const user = await User.findOne();

    user.cart.push(productId);

    await user.save();

    res.redirect("/cart");
});

module.exports = router;