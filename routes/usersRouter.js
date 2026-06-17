console.log("🔥 USERS ROUTER LOADED");

const express = require("express");
const router = express.Router();

const usermodel = require("../models/usermodel");
const productModel = require("../models/product");
const isLogin = require("../middleware/isLogin");

const {
    loginUser,
    registerUser
} = require("../controllers/userController");

// REGISTER
router.get("/register", (req, res) => {
    if (req.cookies.token) return res.redirect("/users/shop");
    res.render("register");
});

router.post("/register", registerUser);

// LOGIN
router.get("/login", (req, res) => {
    if (req.cookies.token) return res.redirect("/users/shop");
    res.render("login");
});
router.post("/login", loginUser);

// LOGOUT
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

// SHOP
router.get("/shop", isLogin, async (req, res) => {
    try {
        const products = await productModel.find();

        res.render("shop", {
            products
        });

    } catch (err) {
        console.log(err);
        res.send("Shop error");
    }
});


router.get("/addtocart/:id", isLogin, async (req, res) => {
    const user = await usermodel.findById(req.user.id);

    const existingItem = user.cart.find(i =>
        i.product.toString() === req.params.id
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({
            product: req.params.id,
            quantity: 1
        });
    }

    await user.save();
    res.redirect("/users/shop");
});


// CART PAGE
router.get("/cart", isLogin, async (req, res) => {
    try {

        const user = await usermodel.findById(req.user.id);

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/users/login");
        }

        await user.populate("cart.product");

        res.render("cart", {
            cart: user.cart || []
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load cart");
        res.redirect("/users/shop");
    }
});
// REMOVE FROM CART (FIXED)
router.get("/remove/:id", isLogin, async (req, res) => {
    try {
        let user = await usermodel.findById(req.user.id);

        user.cart = user.cart.filter(c =>
            c.product.toString() !== req.params.id
        );

        await user.save();

        res.redirect("/users/cart");

    } catch (err) {
        console.log(err);
        res.send("Remove error");
    }
});

router.get("/decrease/:id", isLogin, async (req, res) => {
    try {
        let user = await usermodel.findById(req.user.id);

        let index = user.cart.findIndex(c =>
            c.product.toString() === req.params.id
        );

        if (index !== -1) {
            if (user.cart[index].quantity > 1) {
                user.cart[index].quantity -= 1;
            } else {
                user.cart.splice(index, 1);
            }
        }

        await user.save();
        res.redirect("/users/cart");

    } catch (err) {
        console.log(err);
        res.send("Decrease error");
    }
});

router.get("/increase/:id", isLogin, async (req, res) => {
    try {
        let user = await usermodel.findById(req.user.id);

        let item = user.cart.find(c =>
            c.product.toString() === req.params.id
        );

        if (item) {
            item.quantity += 1;
        }

        await user.save();
        res.redirect("/users/cart");

    } catch (err) {
        console.log(err);
        res.send("Increase error");
    }
});

module.exports = router;