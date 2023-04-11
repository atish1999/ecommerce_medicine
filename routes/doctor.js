const express=require("express");
const {doctorHome,composeGet,composePost,doctorArticleGet}=require("../controller/doctor");
const {articleRead,deleteArticle}=require('../controller/article');

const doctorRouter=express.Router();

doctorRouter.route('/')
    .get(doctorHome);

doctorRouter.route('/compose')
    .get(composeGet)
    .post(composePost)

doctorRouter.route('/articles')
    .get(doctorArticleGet)

doctorRouter.route('/articles/delete')
    .post(deleteArticle)

doctorRouter.route('/articles/:blogId')
    .get(articleRead)

module.exports=doctorRouter;