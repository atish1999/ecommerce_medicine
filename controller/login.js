const medilabDatabase=require('../models/db');
const bcrypt=require('bcrypt');

function loginGet(req,res){
    let message=req.flash('error');
    res.render('login',{message});
}

async function loginPost(req,res){
    try {
        let {role,email,password}=req.body;
        let sql="select * from "+role+" where _email=?;";
        medilabDatabase.query(sql,[email],(err,result)=>{
            if(err){
                throw err;
            }
            if(result.length==0){
                req.flash('error','no such user exit');
                res.redirect('/auth/login');
                return;
            }
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
                  req.flash('error','Password do not match');
                  res.redirect('/auth/login');
                  return;
                  //   res.flash('error','Passwords do not match');
                }
              });
        })
    } catch (err) {
        res.flash('error',err.message);
        res.redirect('/auth/login');
        return;
    }
}

module.exports={
    loginGet,
    loginPost
}