const express=require("express");
const {userHome,userArticlesGet,addCartPost,myCartGet,deleteFromCartPost}=require("../controller/user");
const {articleReadUser}=require('../controller/article');
const {searchMedicineGet,productGet}=require('../controller/medicine');


const userRouter=express.Router();

userRouter.route('/')
    .get(userHome)

userRouter.route('/searchMedicine')
    .get(searchMedicineGet);

userRouter.route('/addCart')
    .post(addCartPost);

userRouter.route('/myCart/delete')
    .post(deleteFromCartPost);

userRouter.route('/myCart/:userName/:userId')
    .get(myCartGet);

userRouter.route('/product/:productId')
    .get(productGet);

userRouter.route('/articles')
    .get(userArticlesGet)

userRouter.route('/articles/:blogId')
    .get(articleReadUser)

module.exports=userRouter;