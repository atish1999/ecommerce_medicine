const express=require("express");
const {userHome}=require("../controller/user");


const userRouter=express.Router();

userRouter.route('/')
    .get(userHome);

module.exports=userRouter;