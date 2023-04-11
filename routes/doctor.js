const express=require("express");
const {doctorHome,composeGet,composePost}=require("../controller/doctor");

const doctorRouter=express.Router();

doctorRouter.route('/')
    .get(doctorHome);

doctorRouter.route('/compose')
    .get(composeGet)
    .post(composePost)

module.exports=doctorRouter;