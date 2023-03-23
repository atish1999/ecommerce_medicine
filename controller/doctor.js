const medilabDatabse=require('../models/db');

function doctorGet(req,res){
    res.render('doctorRegister');
}

function doctorPost(req,res){
    let {name,email,password,mci,mobNumber,sa,city,pa}=req.body;
    let address=sa+"#"+city+"#"+pa;
    let sql='insert into doctor(_mci,_password,_address,_email,_name,_phno) values(?,?,?,?,?,?);';
    medilabDatabse.query(sql,[mci,password,address,email,name,mobNumber],(err,result)=>{
        if(err){
            throw err;
        }
        res.redirect('/auth/login');
    });
}

function doctorHome(req,res){
    res.render('doctor');
}

module.exports={
    doctorGet,
    doctorPost,
    doctorHome
}