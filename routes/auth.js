const route=require('express').Router()
const { getLoginPage, pstLoginPage, logoutFunction }=require('../controllers/auth.controller')
const body=require('express').urlencoded({extended:true})
const {isAuth,notAuth}=require('../controllers/guardAuth.controller') 





route.get('/login',notAuth,getLoginPage)
route.post('/login',body,pstLoginPage)


route.post('/logout',logoutFunction)
module.exports=route