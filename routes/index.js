const express=require('express');
const router = express.Router();
const authRouter=require("./auth");
const userRouter=require("./user");
const doctorRouter=require("./doctor");
const shopOwnerRouter=require("./shopOwner");
const {requireAuthDoctor,requireAuthUsers,requireAuthShopOwner}=require("../controller/utilityFunctions");

router.use('/auth',authRouter);
router.use('/user',requireAuthUsers,userRouter);
router.use('/doctor',requireAuthDoctor,doctorRouter);
router.use('/shopOwner',requireAuthShopOwner,shopOwnerRouter);

module.exports=router;