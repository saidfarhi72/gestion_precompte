const route=require('express').Router()

const { isAuth } = require('../controllers/guardAuth.controller');
const { getOperation, getOperationByDossier } = require('../data/query');




route.get('/',isAuth,async function(req,res) {
    const arr=  await getOperation()
    res.render('history',{arr:arr,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('fileconf')[0]})
});


route.post('/', async function(req, res, next) {

    if(req.body.dossier.length > 0) {
        var operation= await getOperationByDossier(req.body.dossier)
        console.log(req.body.dossier)
        
    }


    res.render('history',{verifUser:req.session.userId,arr:operation})

})




module.exports=route