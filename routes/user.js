const express=require("express");
const {userHome,userArticlesGet,addCartPost,myCartGet}=require("../controller/user");
const {articleReadUser}=require('../controller/article');
const {searchMedicineGet}=require('../controller/medicine');


const userRouter=express.Router();

userRouter.route('/')
    .get(userHome)

userRouter.route('/searchMedicine')
    .get(searchMedicineGet);

userRouter.route('/addCart')
    .post(addCartPost);

userRouter.route('/myCart/:userName/:userId')
    .get(myCartGet);

userRouter.route('/articles')
    .get(userArticlesGet)

userRouter.route('/articles/:blogId')
    .get(articleReadUser)

module.exports=userRouter;