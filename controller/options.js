function optionsGet(req,res){
    res.render('options');
}

function optionsPost(req,res){
    let option=req.body.role;
    if(option==="shopowner"){
        res.redirect('/auth/shopOwnerRegister');
    }else if(option==="doctor"){
        res.redirect('/auth/doctorRegister');
    }else{
        res.redirect('/auth/userRegister');
    }
}

module.exports={
    optionsGet,
    optionsPost
}