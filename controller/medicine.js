const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const path=require('path');
const medilabDatabse=require('../models/db');
const bcrypt=require("bcrypt");
const {uploadMedicine}=require('./utilityFunctions');

function addMedicineGet(req,res){
    res.render('addMedicine');
}

function addMedicinePost(req,res){
try {
    let {name,quantity,mrp,manufacturer,composition,expdate,use,benefits}=req.body;
    let medicineimage=req.files.medicineimage;
    let token=req.cookies.jwt;
    jwt.verify(token,JWT_SECRET,(err,decodedToken)=>{
        if(err){
            console.log(err.message);
            res.redirect('/auth/login');
        }
        let email=decodedToken.email;
        let sql='select * from shopowner where _email=?';
        medilabDatabse.query(sql,[email],(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send('Server Error. Try after some time.')
            }
            let ownerId=result[0]._oid;
            uploadMedicine(name,quantity,mrp,medicineimage,manufacturer,composition,expdate,use,benefits,ownerId);
            console.log(name,quantity,mrp,manufacturer,composition,expdate,use,benefits,ownerId);
            res.redirect('/shopOwner');
        })
    })
} catch (error) {
    
}

   
}

module.exports={
    addMedicineGet,
    addMedicinePost
}