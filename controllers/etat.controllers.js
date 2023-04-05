const { isAuth } = require('../controllers/guardAuth.controller');
const { getRes, getsuivi, getprecpmpteByDossier, getprecompteBYmatricule, getClientByDossier, getAgentByMatricule, getAttestation, getAnnulerByDossier, getIntituleByDossier, getOperbydossier, etat } = require('../data/query');

const fs = require('fs')
const xlsx = require('xlsx');




const onFinished = require('on-finished')


const { join } = require('path');
const { pdf } = require('../wriepdf');

const selectPre=async (req, res, next)=>{

    if(req.body.matricule.length > 0) {
        var precompte= await getprecompteBYmatricule(req.body.matricule)


    }
    if(req.body.dossier.length > 0) {
        var precompte= await getprecpmpteByDossier(req.body.dossier)
        
    }


    res.render('etat',{verifUser:req.session.userId,verifAdmin:req.session.admin,arr:precompte})

}

const attestation=async (req,res) =>{  
    const matricule=req.body.matricule
    console.log(matricule)
    var name;
    try{
  
      const precompte = await getAttestation(matricule)
      const agent= await getAgentByMatricule(matricule)
    
      console.log(agent)
      console.log(precompte)
  
    if(agent.length > 0) {
      var etat=[]
      var anticipation=[] 
    await Promise.all(precompte.map( async (el)=>{
  
      var list=[]
      var list2=[]
      
      var compense= await getAnnulerByDossier(el.dossier)
      var intitule= await getIntituleByDossier(el.dossier)
      var operation= await getOperbydossier(el.dossier)
      console.log(intitule,operation,compense)
      list.push(el.dossier)
      
      list.push(intitule[0].utilities)
      list.push(el.datdebet.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
          day: '2-digit',
        }))
        list.push(el.datefinet.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }))
  
        if(compense.length>0){
          list2.push(intitule[0].utilities)
  
          list2.push(el.dossier)
  
          list2.push(compense[0].insert_at.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }))
        }
  
      
      list.push(`${el.totalpre/100}`)
      list.push(el.menspret/100)
      list.push(`${(el.totalpre)/el.menspret}`)
  
  
  
  
      if(compense.length>0){
        list.push(`${(el.totalpre-el.restpaye)/100}`)
        list.push(`0`)
        list2.push(el.restpaye/100)
        list2.push(operation[0].operation)
        list2.push(operation[0].remarque)
  
  
  
  
  
        
      }else{
  
        list.push(`${(el.totalpre-el.restpaye)/100}`)
        list.push(el.restpaye/100)
      }
      list.push(el.montcomp/100)
      
      
      anticipation.push(list2)
      etat.push(list)
    })
    )
    
    res.render('etatpayment',{etat:etat,anticipation:anticipation,matricule:matricule,arr:[],verifUser:req.session.userId,verifAdmin:req.session.admin,message:req.flash('attestation')[0],})
    }else{
      req.flash('attestation', 'this matricule does not exist')
      res.redirect('/etat/attestation/')
    
    }
    }catch(err){
      req.flash('attestation', 'wrong type of matricule')
      res.redirect('/etat/attestation/')
  
    }
  
  
  }
  const downloadAtt=async (req,res)=> {  
    const name= Date.now()
    const id =req.params.id
    console.log(req.params.id)
   
  
      try{
  
        const precompte = await getAttestation(id)
        const agent= await getAgentByMatricule(id)
      
      
      if(agent.length > 0) {
      
        await pdf(precompte,agent,name,res )
      }else{
        req.flash('attestation', 'this matricule does not exist')
        res.redirect('/etat/attestation/')
      
      }
      }catch(err){
        req.flash('attestation', 'wrong type of matricule')
        res.redirect('/etat/attestation/')
  
      }
  }

  const total=async (req,res)=>{
    var eta= await etat()
    var list=[]
    eta.map(element => {
      let etatByintitle={}
      var sumAnticip
      var sumPre
      if(element.sum_antici==undefined){
        sumAnticip=0
  
      }else{
        sumAnticip=element.sum_antici
      }
      if(element.sum_pre==undefined){
        sumPre=0
  
      }else{
        sumPre=element.sum_pre
      }
      var totalPre=sumAnticip+sumPre
      etatByintitle['intitule']=element.utilities
  
      etatByintitle['Total_credit']=element.sum_credit
      etatByintitle['Total_pre']=totalPre
      etatByintitle['Rest']=element.sum_credit-totalPre
  
      list.push(etatByintitle)
  
    });
    console.log(list)
    const name=Date.now()
    
    
    if(list.length > 0) {
  
      const ws = xlsx.utils.json_to_sheet(list)
    
      const wb = xlsx.utils.book_new()
    
      xlsx.utils.book_append_sheet(wb, ws, 'Responses')
    
      xlsx.writeFile(wb, './assets/trash/'+'etat'+name+'.xlsx')
      res.redirect('total/download/'+name)
  
  
  
  
  
    
  }
  else{
    res.redirect('/etat')
  
  }
}

const downloadTot=async(req,res,next) => {
 

    const name=req.params.id
    const filePath = join(process.cwd(), '/assets/trash/'+'etat'+name+'.xlsx')
    console.log(filePath)
  
    res.download(filePath)
  
    onFinished(res, function (err, res) {
      fs.unlinkSync(filePath)
  
    })
 

}




module.exports={
    selectPre,
    attestation,
    downloadAtt,
    total,
    downloadTot


}