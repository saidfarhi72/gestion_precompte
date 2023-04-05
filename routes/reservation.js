const route=require('express').Router()
const {readFile,reservation, download, dowloadDuplcated, writeDuplcated, writeElredyRes, dowloadElredyRes, dowloadNotInsertClient, writeNotInsertClient, dowloadnotINsertedRes, writenotINsertedRes}=require('../controllers/Reservation.controller')
const multer=require('multer');
const { isAuth, isadmin } = require('../controllers/guardAuth.controller');
const { getRes, getIntitule, max_dossier } = require('../data/query');

route.get('/', isAuth,isadmin,async function(req,res) {  
    const max_dossiers= await max_dossier() 
    const  max_dos=max_dossiers[0].max_dossier
    const arr =await getRes ()
    const intitule = await getIntitule()
    res.render('reservation',{max_dossier:max_dos,arr:arr.splice(1,100),intitule:intitule,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('file')[0],succes:req.flash('inserted')[0],faildIntitule:req.flash('intitule')[0],no:req.flash('not client')[0]})




    

    
});
route.get('/intitule', isAuth,isadmin,async function(req,res) {   
    const arr =await getRes ()
    res.send({arr})




    
})

route.post('/upload',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/excel/')  
          },
        filename:function (req, file, cb) {
     
            cb(null, Date.now()+'-'+ file.originalname )      
        },
        

        
    })
    }).single('file'),readFile)
    

route.get('/download',isAuth,isadmin, reservation)





route.get('/reponse',isAuth,isadmin,function(req,res) {
    res.render('RepReservation',{verifUser:req.session.userId,verifAdmin:req.session.admin})
});


route.get('/duplicated/download',isAuth,isadmin, writeDuplcated)
route.get('/duplicated/download/:id',isAuth,isadmin,dowloadDuplcated )



route.get('/elreadyRes/download',isAuth,isadmin, writeElredyRes)
route.get('/elreadyRes/download/:id',isAuth,isadmin,dowloadElredyRes )

route.get('/notInsertRes/download',isAuth,isadmin, writenotINsertedRes)
route.get('/notInsertRes/download/:id',isAuth,isadmin,dowloadnotINsertedRes )

route.get('/notInsertClient/download',isAuth,isadmin, writeNotInsertClient)
route.get('/notInsertClient/download/:id',isAuth,isadmin,dowloadNotInsertClient )




module.exports=route