const fs = require('fs')
const {join} = require('path');
const { insertfile, get_annulation, inserted_annulation, insertReponseAnnulation, en_cours_annualtion, insertAnnulation, insertOperation, getAnnulerByDossier } = require('../data/query');

const compatible= (number,ind)=>{
    const str=number.toString();
    if(ind===1 && str.length<7){
  
        return '0'.repeat(7-str.length) +str;
  
  
  }
  if(ind===3 && str.length<4){
  
    return '0'.repeat(4-str.length) +str;
  
  
  }
  if(ind===2 && str.length<6){
  
    return '0'.repeat(6-str.length) +str;
  
  }
  if(ind===4 && str.length<30){
  

    return str+' '.repeat(30-str.length) ;
  
  }
  return str
  
  
  }
  const format= (number)=>{
    const str=number.toString();
    if( str.length<2){
  
        return '0'.repeat(2-str.length) +str;
  
  
  }return str
  }
  
const annulation =  async (req,res) => {
    const reser=await get_annulation()

    if( reser.length > 0 ){
        
    const namee=Date.now()
    const arrayy=reser.map((l)=>{
      var listdate=l.date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/')
      var MonthDebut=parseInt( listdate[0])+1
      var dateDebut='01'+format(`${MonthDebut}`)+listdate[2]
      var Monthfin=(l.montant_credit/l.montant_de_mensualite+MonthDebut)%12
      var yearadd=Math.floor((l.montant_credit/l.montant_de_mensualite+MonthDebut)/12)
      var datefin='01'+format(`${Monthfin-1}`)+`${yearadd+parseInt(listdate[2])}`
        
        const id=l.cin.match(/(\d+)/)
        const idint=id[0]
        const idstr=l.cin.replace(id[0],'')
        const ligne=l.code_organisme+'|'+l.code_revendeur+'|'+compatible(l.name,4)+'|'+idstr+'|'+compatible(idint,2)+'|'+compatible(l.matricule,1)+'|'+compatible(l.imputation,3)+'|'+'4'+'|'+l.dossier+'|0000000|0000000|0000000|0000000|0000000|'+l.montant_credit+'|'+l.montant_credit+'|'+'0000'+'|'+compatible(l.montant_de_mensualite,1)+'|'+`${l.montant_credit/l.montant_de_mensualite}`+'|'+dateDebut+'|'+datefin
        
      

        
        return ligne
    })



     var stream = fs.createWriteStream('./assets/annulation/'+namee+'-annulation.pre', {flags:'a'});
      for(const stri of arrayy) {
        stream.write(stri+'\n')
       
      }

      stream.end();
       insertfile('./assets/annulation/'+namee+'-annulation.pre','pre',req.session.userId)
       stream.on('finish', async function () {
        // do stuff with the PDF file
        const filePath ='./assets/annulation/'+namee+'-annulation.pre'
  
        await inserted_annulation()
      
    
      }) 

    
   }else{

       res.redirect('/annulation')
   }



}



const read_annulation=async  (req,res)=>{
    const extension=req.file.originalname.split('.')[1]
    var dont=[]
    try{

      if(extension=='rep'){

          const allFileContents = fs.readFileSync(req.file.path, 'utf-8');
         await Promise.all( allFileContents.split(/\r?\n/).forEach(async function(line) {
              if(line==='') return
              const code_organisme=line.substring(0,4).trim();
              const name=line.substring(4,34).trim();
              const cin=line.substring(34,43).trim();
              const matricule=line.substring(43,50).trim();
              const imputation=line.substring(50,54).trim();
              const dossier=line.substring(54,61).trim();
              const code_retour=line.substring(61,63).trim();
              
              console.log(code_organisme+'//'+name+'//'+cin+'//'+matricule+'//'+imputation+'//'+dossier+'//'+code_retour)
            try{
              
              await insertReponseAnnulation(dossier,matricule,code_retour)
            }catch(e){
                dont.push(line)

            }
            console.log('con not inserted ' +dont)
               
      
          }))
          insertfile(req.file.path,'rep',req.session.userId)

          res.redirect('/annulation/reponse')
      }else{
        fs.unlinkSync(req.file.path)
        req.flash('annulation','extension should be .rep')

        res.redirect('/annulation/reponse')
    
    
      }
    }catch(err){
      fs.unlinkSync(req.file.path)
        req.flash('fileconf','file error')

        res.redirect('/annulation/reponse')

    }


}

const raison_annulation=async (req,res)=>{
  const id=req.params.id
  if(req.body.raison==='règlement par anticipation'){
    if(req.file===undefined){
      req.flash('baddata',"file is required")

      res.redirect('/annulation/delete/'+id)
    }else{
   
    try{
      
      await insertOperation(id,req.session.email,req.body.raison,req.body.remarque)
      await en_cours_annualtion(id)
      await insertAnnulation(req.file.path,id,req.body.raison)
      
      res.redirect('/annulation')
  }catch(e){  
    console.log(e)
    req.flash('baddata',"remarque non accepte")

    res.redirect('/annulation/delete/'+id)

  }

  }

    

  }else{

      try{
      
          await insertOperation(id,req.session.email,req.body.raison,req.body.remarque)
          await en_cours_annualtion(id)
          await insertAnnulation('not exist',id,req.body.raison)
          
          res.redirect('/annulation')
      }catch(e){  
        console.log(e)
        req.flash('baddata',"remarque non accepte")
  
        res.redirect('/annulation/delete/'+id)
  
      }
    
      console.log('deleted')   
  }


}


const download =async  (req,res)=>{
  
        id=req.params.id;
        const filePath = join(process.cwd(), 'assets/annulation/',id +'-annulation.con')
        res.download(filePath)
        inserted_annulation()
        req.session.res=[]
       

    
}







module.exports ={
    annulation,
    download,
    read_annulation,
    raison_annulation
    
 
}
