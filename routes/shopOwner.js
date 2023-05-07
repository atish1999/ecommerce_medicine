const express=require("express");
const {shopOwnerHome,shopOwnerReportGet}=require("../controller/shopOwner");
const {addMedicineGet,addMedicinePost,ownerMedicineStocks,deleteMedicine,updateMedicineGet,updateMedicinePost}=require("../controller/medicine");

const shopOwnerRouter=express.Router();

shopOwnerRouter.route('/')
    .get(shopOwnerHome);

shopOwnerRouter.route('/add')
    .get(addMedicineGet)
    .post(addMedicinePost)

shopOwnerRouter.route('/report/:ownerId')
    .get(shopOwnerReportGet);

shopOwnerRouter.route('/stocks')
    .get(ownerMedicineStocks)

shopOwnerRouter.route('/stocks/delete')
    .post(deleteMedicine)

shopOwnerRouter.route('/stocks/edit/:productId')
    .get(updateMedicineGet)
    .post(updateMedicinePost)

module.exports=shopOwnerRouter;