function loginGet(req,res){
    res.render('login');
}

function loginPost(req,res){
    let {role,email,password}=req.body;
    // verify from the backend about email and password
    // once verified redirect to specific role page
    if(role==="user"){
        res.redirect('/user');
    }else if(role==="doctor"){
        res.redirect('/doctor')
    }else{
        res.redirect('/shopOwner')
    }
}

module.exports={
    loginGet,
    loginPost
}