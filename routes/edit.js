const route=require('express').Router()
const { isAuth, isadmin } = require('../controllers/guardAuth.controller');
const { reservation } = require('../controllers/Reservation.controller');
const { getsettings, updateReservationsettings } = require('../data/query');

route.get('/reservation', isAuth,isadmin,async function(req,res) {  
    const settings= await getsettings()
    const setting= settings.length > 0 ? settings[0].reservation.split('|'):[]
    res.render('editreservation',{setting,verifUser:req.session.userId,verifAdmin:req.session.admin})




    
});
route.post('/reservation',async function(req,res) {
    const body=req.body
    const settings = body.code_organisme+'|'+body.matricule+'|'+body.name+'|'+body.cin_char+'|'+body.cin_int+'|'+body.code+'|'+body.dossier+'|'+body.dure_de_pret+'|'+body.mois_differes+'|'+body.imputation+'|'+body.montant_TGR
    console.log(settings)
    updateReservationsettings(settings)
    res.redirect('/reservation')




    

    
})











module.exports=route