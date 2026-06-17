const usermodel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utiles/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        let existingUser = await usermodel.findOne({ email });
        if (existingUser) return res.status(400).send("User already exists");

        let hashedPassword = await bcrypt.hash(password, 10);

        let user = await usermodel.create({
            email,
            password: hashedPassword,
            fullname,
        });

        let token = generateToken(user);

        res.cookie("token", token);
        res.send("User created");
    } 
    catch (err) {
        console.log(err.message);
        res.status(500).send("Error");
    }
};


// LOGIN
module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        let user = await usermodel.findOne({ email });
        if (!user) return res.status(400).send("Email or password incorrect");

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Email or password incorrect");
        }

        let token = generateToken(user);

        res.cookie("token", token);
         res.redirect("/shop");
    } 
    catch (err) {
        console.log(err.message);
        res.status(500).send("Login error");
    }
};

module.exports.logout = function(req,res){
    res.cookie("token","");
    res.redirect("/");
}