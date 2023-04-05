
const route=require('express').Router()
const multer=require('multer');
const { isAuth, isadmin } = require('../controllers/guardAuth.controller');
const { read_reponse, downloaddef, downloadfile, writeAccept, dowloadAccept, writeNotAccept, dowloadNotAccept } = require('../controllers/reponse.controller')






route.get('/',isAuth,isadmin,function(req,res) {
    res.render('RepReservation',{verifUser:req.session.userId,verifAdmin:req.session.admin,faild:req.flash('faildreponse')[0],succes:req.flash('reponse')[0]})
});


route.post('/',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/uploads-res/')  
          },
        filename:function (req, file, cb) {
                cb(null, Date.now()+'-'+ file.originalname )      
        }
    })
    }).single('file'),read_reponse)

route.get('/download',isAuth,isadmin, downloadfile)

//----------------------------------------------------------
route.get('/accepte/download',isAuth,isadmin, writeAccept)
route.get('/accepte/download/:id',isAuth,isadmin, dowloadAccept)

//------------------------------------------------------------
route.get('/notaAccept/download',isAuth,isadmin, writeNotAccept)
route.get('/notaAccept/download/:id',isAuth,isadmin, dowloadNotAccept)


module.exports=route