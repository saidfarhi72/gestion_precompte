
const route=require('express').Router()
const multer=require('multer');
const { isAuth } = require('../controllers/guardAuth.controller');
const {  get_annulation, get_annulation_instance } = require('../data/query');
const { annulation, download, read_annulation, annuler_instance } = require('../controllers/annulation_instance.controller ');





route.get('/', isAuth,async function(req,res) {   
    const arr =await get_annulation_instance ()
    res.render('annulationInstance',{arr:arr,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('file')[0]})



    
});

route.get('/delete/:id', isAuth,annuler_instance);






route.get('/reponse', isAuth,async function(req,res) {   
    const arr =await get_annulation ()
    res.render('repAnnulationInstance',{arr:arr,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('annulationInstance')[0]})




    
});

route.post('/reponse',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/annulation-instance-rep/')  
          },
        filename:function (req, file, cb) {
                cb(null, Date.now()+'-'+ file.originalname )      
        }
        

    })
    }).single('file'),read_annulation)

route.get('/download',isAuth, annulation)
route.get('/download/:id',isAuth, download)

module.exports=route