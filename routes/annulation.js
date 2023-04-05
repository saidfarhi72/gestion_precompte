
const route=require('express').Router()
const multer=require('multer');
const { isAuth } = require('../controllers/guardAuth.controller');
const {  get_annulation,  en_cours_annualtion, getAnnulerByDossier, getEncoursAnnulationByDossier } = require('../data/query');
const { annulation, download, read_annulation, raison_annulation } = require('../controllers/annulation.controller');

var user=[


    {
        name: 'admin',
        matricule:5544646,
        dossier:654656,
        cin:'id156161'
    },
    {
        name: 'admin',
        matricule:5544646,
        dossier:654656,
        cin:'id156161'
    },
    {
        name: 'admin',
        matricule:5544646,
        dossier:654656,
        cin:'id156161'
    },




    {
        name: 'admin',
        matricule:5544646,
        dossier:654656,
        cin:'id156161'
    },

]



route.get('/', isAuth,async function(req,res) {   
    const arr =await get_annulation ()
    res.render('annulation',{arr:arr,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('file')[0]})


    
    
});

route.get('/delete/:id', isAuth,async function(req,res) {
    const id=req.params.id;
    const getannuler=await getEncoursAnnulationByDossier(id)
    console.log(getannuler)

    if(getannuler.length > 0){
        req.flash('existAnnuler','deja annuler')
        res.redirect('/credit')




    }else{

        res.render('update',{id:id,verifUser:req.session.userId,verifAdmin:req.session.admin,baddata:req.flash('baddata')[0]});
    }


 
});




route.post('/delete/:id',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/attestation-anticipation/')  
          },
        filename:function (req, file, cb) {
                cb(null, Date.now()+'-'+ file.originalname )      
        }
        

    })
    }).single('file'),raison_annulation)

route.get('/reponse', isAuth,async function(req,res) {   
    const arr =await get_annulation ()
    res.render('repAnnulation',{arr:arr,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('annulation')[0]})




    
});

route.post('/reponse',multer({
    storage:multer.diskStorage({
        destination:function (req, file, cb) {
                cb(null, 'assets/annulation-rep/')  
          },
        filename:function (req, file, cb) {
                cb(null, Date.now()+'-'+ file.originalname )      
        }
        

    })
    }).single('file'),read_annulation)

route.get('/download',isAuth, annulation)
route.get('/download/:id',isAuth, download)

module.exports=route