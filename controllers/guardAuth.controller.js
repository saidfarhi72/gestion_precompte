
const isAuth=(req,res,next)=>{
    if(req.session.email){
        next()
    }else{
        res.redirect('/login')
    }
}


const notAuth=(req,res,next)=>{
    if(req.session.email){
        res.redirect('/')
    }else{
       next()
    }
}
const isadmin=(req,res,next)=>{
    if(req.session.admin){
        next()

    }else{
        res.redirect('/')
    }
}

module.exports ={
    isAuth,
    notAuth,
    isadmin
}