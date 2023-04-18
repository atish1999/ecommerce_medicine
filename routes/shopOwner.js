const express=require("express");
const {shopOwnerHome}=require("../controller/shopOwner");
const {addMedicineGet,addMedicinePost,ownerMedicineStocks,deleteMedicine}=require("../controller/medicine");

const shopOwnerRouter=express.Router();

shopOwnerRouter.route('/')
    .get(shopOwnerHome);

shopOwnerRouter.route('/add')
    .get(addMedicineGet)
    .post(addMedicinePost)

shopOwnerRouter.route('/stocks')
    .get(ownerMedicineStocks)

shopOwnerRouter.route('/stocks/delete')
    .post(deleteMedicine)

module.exports=shopOwnerRouter;