
const route=require('express').Router()
const { isAuth } = require('../controllers/guardAuth.controller');
const {  getsuivi} = require('../data/query');

const { selectPre, attestation, downloadAtt, total, downloadTot } = require('../controllers/etat.controllers');






route.get('/', isAuth,async function(req,res) {  
 /* 
   
  */
  
  const arr =await getsuivi ()
  res.render('etat',{arr:arr.splice(1,100),verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('file')[0]})

    
});

route.post('/', selectPre)

route.get('/attestation', isAuth,async function(req,res) {  
  var name;
  const precompte =[]
  res.render('attestation',{users:precompte,verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('attestation')[0],name:name})


})
route.post('/attestation', isAuth,attestation)
route.get('/attestation/:id', isAuth,downloadAtt)
route.get('/total',isAuth,total)


route.get('/total/download/:id',isAuth,downloadTot)











module.exports = route