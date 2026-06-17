
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    console.log("JWT_KEY =", process.env.JWT_KEY);
    
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
        },
        process.env.JWT_KEY
    );
};

module.exports.generateToken = generateToken;