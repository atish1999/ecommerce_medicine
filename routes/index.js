const express=require('express');
const router = express.Router();
const authRouter=require("./auth");
const userRouter=require("./user");
const doctorRouter=require("./doctor");
const shopOwnerRouter=require("./shopOwner");
const {requireAuth}=require("../controller/utilityFunctions");

router.use('/auth',authRouter);
router.use('/user',requireAuth,userRouter);
router.use('/doctor',requireAuth,doctorRouter);
router.use('/shopOwner',requireAuth,shopOwnerRouter);

module.exports=router;