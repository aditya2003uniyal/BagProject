const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/users/login");
    }

    try {
        const decoded = jwt.verify(token, "helloworld");
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect("/users/login");
    }
};