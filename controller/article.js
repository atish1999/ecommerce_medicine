const medilabDatabse=require('../models/db');
const fs=require('fs');
const path=require('path');
const {getTodayDate}=require("./utilityFunctions");

function articleRead(req,res){
    let blogId=req.params.blogId;
    let sql='select * from blog where _bid=?';
    medilabDatabse.query(sql,[blogId],(err,article)=>{
        if(err){
            res.status(500).send("server error. try after some time");
        }
        res.render('readBlog',{article});
    })
}

function articleReadUser(req,res){
    let blogId=req.params.blogId;
    let sql='select * from blog where _bid=?';
    medilabDatabse.query(sql,[blogId],(err,article)=>{
        if(err){
            res.status(500).send("server error. try after some time");
        }
        let doctorId=article[0]._did;
        let sql='select * from doctor where _did=?';
        medilabDatabse.query(sql,[doctorId],(err,doctor)=>{
            if(err){
                res.status(500).send("server error. try after some time");
            }
            res.render('readBlogUser',{article,doctor});
        })
    })
}

function deleteArticle(req,res){
    let inputArr=req.body.button.split("^");
    let blogId=inputArr[0];
    let imageName=inputArr[1];
    let sql='delete from blog where _bid=?';
    medilabDatabse.query(sql,[blogId],(err,result)=>{
        if(err)
        {
            res.status(500).send("server error. try after some time");
        }
        fs.unlinkSync(path.join(__dirname,'..','/public/uploads',imageName));
        res.redirect('/doctor/articles');
    })
}

function editArticleGet(req,res){
    let blogId=req.params.blogId;
    let sql='select * from blog where _bid=?';
    medilabDatabse.query(sql,[blogId],(err,article)=>{
        if(err){
            res.status(500).send("server error. try after some time");
        }
        res.render('editBlog',{article});
    })
}

function editArticlePost(req,res){
    let blogId=req.params.blogId;
    let {blogtitle,blogcontent,button}=req.body;
    let blogimage=req.files.blogimage;
    blogimage.name=Date.now()+blogimage.name;
    fs.unlinkSync(path.join(__dirname,'..','/public/uploads',button));
    let uploadPath=path.join(__dirname,'..','/public/uploads',blogimage.name);
    console.log(blogimage.name);
    let currentDate=getTodayDate();
    blogimage.mv(uploadPath,(err)=>{
        if(err)
        {
            console.log(err);
        }
        let sql='update blog set _title=?, _content=?, _image=?, _date=? where _bid=?';
        medilabDatabse.query(sql,[blogtitle,blogcontent,blogimage.name,currentDate,blogId],(err,result)=>{
            if(err){
                res.status(500).send("Server Error. Try After some time.")
            }
        
        })
        res.redirect('/doctor/articles');
    })
    
}

module.exports={
    articleRead,
    articleReadUser,
    deleteArticle,
    editArticleGet,
    editArticlePost
}