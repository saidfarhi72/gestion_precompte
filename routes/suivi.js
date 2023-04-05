const route=require('express').Router()
const multer=require('multer');
const { isAuth } = require('../controllers/guardAuth.controller');
const { read_suivi } = require('../controllers/suivi.controller');
const { getRes, getsuivi } = require('../data/query');

route.get('/upload', isAuth,async function(req,res) {   
    const arr =await getsuivi ()
    res.render('suivi',{arr:arr.splice(1,100),verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('file')[0],dont:req.flash('not inserted ')[0],yes:req.flash('inserte')[0]})




    
});

route.post('/upload',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/suivi/')  
          },
        filename:function (req, file, cb) {
     
            cb(null, Date.now()+'-'+ file.originalname )      
        },
        

        
    })
    }).single('file'),read_suivi)
    


route.get('/reponse',isAuth,function(req,res) {
    res.render('RepReservation',{verifUser:req.session.userId})
});



module.exports=route