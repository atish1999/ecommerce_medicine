const express=require("express");
const {shopOwnerHome}=require("../controller/shopOwner");
const {addMedicineGet,addMedicinePost}=require("../controller/medicine");

const shopOwnerRouter=express.Router();

shopOwnerRouter.route('/')
    .get(shopOwnerHome);

shopOwnerRouter.route('/add')
    .get(addMedicineGet)
    .post(addMedicinePost)

module.exports=shopOwnerRouter;