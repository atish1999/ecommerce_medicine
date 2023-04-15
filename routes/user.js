const express=require("express");
const {userHome,userArticlesGet}=require("../controller/user");
const {articleReadUser}=require('../controller/article');


const userRouter=express.Router();

userRouter.route('/')
    .get(userHome);

userRouter.route('/articles')
    .get(userArticlesGet)

userRouter.route('/articles/:blogId')
    .get(articleReadUser)

module.exports=userRouter;