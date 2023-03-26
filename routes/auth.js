const express=require("express");
const {optionsGet,optionsPost}=require("../controller/options");
const {shopOwnerGet,shopOwnerPost}=require("../controller/shopOwner");
const {doctorGet,doctorPost}=require("../controller/doctor");
const {userGet,userPost}=require("../controller/user")
const {loginGet,loginPost,forgotPasswordGet,forgotPasswordPost,resetPasswordGet,resetPasswordPost}=require("../controller/login")

const authRouter=express.Router();

authRouter.route('/options')
    .get(optionsGet)
    .post(optionsPost);

authRouter.route('/shopOwnerRegister')
    .get(shopOwnerGet)
    .post(shopOwnerPost);

authRouter.route('/doctorRegister')
    .get(doctorGet)
    .post(doctorPost);

authRouter.route('/userRegister')
    .get(userGet)
    .post(userPost);

authRouter.route('/login')
    .get(loginGet)
    .post(loginPost);

authRouter.route('/forgotPassword')
    .get(forgotPasswordGet)
    .post(forgotPasswordPost);

authRouter.route('/resetPassword/:id/:role/:token')
    .get(resetPasswordGet)
    .post(resetPasswordPost)

module.exports=authRouter;