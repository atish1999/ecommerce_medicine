function shopOwnerGet(req,res){
    res.render('shopOwnerRegister');
}

function shopOwnerPost(req,res){
    let {name,email,password,pci,mobNumber,address}=req.body;
    console.log(name,email,password,pci,mobNumber,address);
    // save this data to backend
    res.redirect('/auth/login');
}

function shopOwnerHome(req,res){
    res.render('shopOwner');
}

module.exports={
    shopOwnerGet,
    shopOwnerPost,
    shopOwnerHome
}