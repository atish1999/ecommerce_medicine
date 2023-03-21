const express=require('express');
const router = express.Router();
const authRouter=require("./auth");
const userRouter=require("./user");
const doctorRouter=require("./doctor")
const shopOwnerRouter=require("./shopOwner")

router.use('/auth',authRouter);
router.use('/user',userRouter);
router.use('/doctor',doctorRouter);
router.use('/shopOwner',shopOwnerRouter);

module.exports=router;