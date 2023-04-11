const medilabDatabse=require('../models/db');
const fs=require('fs');
const path=require('path');

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
        console.log(result);
        fs.unlinkSync(path.join(__dirname,'..','/public/uploads',imageName));
        res.redirect('/doctor/articles');
    })
}

module.exports={
    articleRead,
    deleteArticle
}