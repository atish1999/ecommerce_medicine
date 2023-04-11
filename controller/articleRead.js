const medilabDatabse=require('../models/db');

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

module.exports={
    articleRead
}