const usermodel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN
module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await usermodel.findOne({ email });
        if (!user) return res.status(400).send("User not found");

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid password");

        let token = jwt.sign(
            { id: user._id, email: user.email },
            "helloworld"
        );

        res.cookie("token", token);
        res.redirect("/users/shop");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Login error");
    }
};

// REGISTER
module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname } = req.body;

        let existing = await usermodel.findOne({ email });
        if (existing) return res.send("User already exists");

        let hash = await bcrypt.hash(password, 10);

        let user = await usermodel.create({
            email,
            password: hash,
            fullname,
        });

        let token = jwt.sign(
            { id: user._id, email: user.email },
            "helloworld"
        );

        res.cookie("token", token);
        res.redirect("/users/shop");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Register error");
    }
};