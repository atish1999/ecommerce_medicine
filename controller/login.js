const medilabDatabase=require('../models/db');
const bcrypt=require('bcrypt');

function loginGet(req,res){
    res.render('login');
}

async function loginPost(req,res){
    try {
        let {role,email,password}=req.body;
        let sql="select * from "+role+" where _email=?;";
        medilabDatabase.query(sql,[email],(err,result)=>{
            if(err){
                throw err;
            }
            console.log(result);
            bcrypt.compare(password, result[0]._password, function(err, response) {
                if (err){
                    // for now logging the message
                    console.log(err.message);
                    return;
                    // res.flash('error',err.message);
                }
                if (response) {
                    // res.cookie('isLoggedIn',true);
                    if(role==="users"){
                        res.redirect('/user');
                    }else if(role==="doctor"){
                        res.redirect('/doctor')
                    }else{
                        res.redirect('/shopOwner')
                    }
                } else {
                  // response is OutgoingMessage object that server response http request
                  console.log("paswords do not match");
                //   res.flash('error','Passwords do not match');
                }
              });
        })
    } catch (err) {
        // res.flash('error',err.message);
        console.log(err.message);
    }
}

module.exports={
    loginGet,
    loginPost
}