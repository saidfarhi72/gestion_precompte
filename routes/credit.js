const { isAuth, isadmin } = require('../controllers/guardAuth.controller');
const { client_finel, getClientByDossier, getClientByMatricule } = require('../data/query');

const route = require('express').Router()



route.get('/credit',isAuth, async function(req, res, next) {
    const user=await client_finel()
    console.log(req.session.userId)


    res.render('credit',{verifUser:req.session.userId,verifAdmin:req.session.admin,users:user,dejaAnnuler:req.flash('existAnnuler')[0],dejaAnnulerInstance:req.flash('existAnnulerInstance')[0]})

})


route.post('/credit', async function(req, res, next) {
    var user
    if(req.body.dossier){
         user= await getClientByDossier(req.body.dossier)

    }
    if(req.body.matricule){
         user= await getClientByMatricule(req.body.matricule)

    }

    res.render('credit',{verifUser:req.session.userId,verifAdmin:req.session.admin,users:user,dejaAnnuler:req.flash('existAnnuler')[0],dejaAnnulerInstance:req.flash('existAnnulerInstance')[0]})

})

route.get("/update-user/:id",isAuth, async function(req,res){
    const dossier = req.params.id
    const user= await getClientByDossier(dossier)
    res.render('update',{user:user[0],verifUser:req.session.userId,verifAdmin:req.session.admin});
  })










module.exports =route