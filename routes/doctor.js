const express=require("express");
const {doctorHome,composeGet,composePost,doctorArticleGet}=require("../controller/doctor");
const {articleRead}=require('../controller/articleRead');

const doctorRouter=express.Router();

doctorRouter.route('/')
    .get(doctorHome);

doctorRouter.route('/compose')
    .get(composeGet)
    .post(composePost)

doctorRouter.route('/articles')
    .get(doctorArticleGet)

doctorRouter.route('/articles/:blogId')
    .get(articleRead)

module.exports=doctorRouter;