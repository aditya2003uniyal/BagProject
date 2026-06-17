const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");

const Product = require("../models/product");

// CREATE PRODUCT
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        let {
            name,
            price,
            discount,
            bgcolor,
            pannelcolor,
            textcolor,
        } = req.body;

        let product = await Product.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            textcolor,
            pannelcolor
        });

        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");

    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});


// SHOP PAGE
router.get("/shop", async (req, res) => {
    const products = await Product.find();
    res.render("shop", { products });
});


// CREATE PAGE
router.get("/create", (req, res) => {
    res.render("createProduct");
});

module.exports = router;