const express=require("express");
const {shopOwnerHome}=require("../controller/shopOwner")


const shopOwnerRouter=express.Router();

shopOwnerRouter.route('/')
    .get(shopOwnerHome);

module.exports=shopOwnerRouter;