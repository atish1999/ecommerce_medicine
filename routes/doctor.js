const express=require("express");
const {doctorHome}=require("../controller/doctor");


const doctorRouter=express.Router();

doctorRouter.route('/')
    .get(doctorHome);

module.exports=doctorRouter;