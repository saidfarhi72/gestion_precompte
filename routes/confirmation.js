const multer  = require('multer');
const route=require('express').Router()
const {read_confirmation, writeNotAcceptConfirmation, dowloadNotAcceptConfirmation} = require('../controllers/confirmation.controller');
const { isAuth, isadmin } = require('../controllers/guardAuth.controller');



route.get('/',isAuth,isadmin,function(req,res) {
    res.render('RepConfirmation',{verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('fileconf')[0],succes:req.flash('succesconfirmation')[0],dont:req.flash('not inserted conf')[0]})
});

route.post('/',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/uploads-conf/')  
          },
        filename:function (req, file, cb) {
                cb(null, Date.now()+'-'+ file.originalname )      
        }
        
    })
    }).single('file'),read_confirmation)



route.get('/notaAccept/download',isAuth,isadmin, writeNotAcceptConfirmation)
route.get('/notaAccept/download/:id',isAuth,isadmin, dowloadNotAcceptConfirmation)
    


    
module.exports=route
