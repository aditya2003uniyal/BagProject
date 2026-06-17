const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLogin");
const isOwner = require("../middleware/isOwner");


router.get("/admin",function(req,res){
  let success =req.flash("success");
  res.render("createProducts",{success});
})


module.exports = router;