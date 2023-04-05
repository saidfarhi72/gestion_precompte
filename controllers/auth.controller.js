const { getuser } = require("../data/query")




const getLoginPage=(req,res,next)=>{


    res.render('login',{verifUser:req.session.userId,verifAdmin:req.session.admin,messagePSs:req.flash('password')[0],messagemail:req.flash('email')[0]})
}
const pstLoginPage= async (req,res,next)=>{
    const users = await getuser(req.body.email,req)


        if(users.length>0){
            
            if( users[0].password === req.body.password ){
    
                req.session.userId=users[0].name
                req.session.email=users[0].email

                req.session.admin=users[0].admin
                console.log(req.session.admin) 
                console.log(req.session.userId)

                res.redirect('/')

                return
            }
            else{
                req.flash('password','invalid password')
            }
            
        }else{
            req.flash('email','invalid email')
            
        }

        res.redirect('/login')

    
}
const logoutFunction=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}

module.exports={
    getLoginPage,
    pstLoginPage,
    logoutFunction
}