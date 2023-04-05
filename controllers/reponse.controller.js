
const fs = require('fs')
const {join} = require('path');
const XLSX=require('xlsx')
const { insertReponseReservation, inserted_confirmation, getRes, getConfirmation, insertfile, getAcceptREservation, getNotAcceptReservation, printedAccept, printedReject, getsettings } = require('../data/query');

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

const read_reponse= async (req,res)=>{
  try{

    const extension=req.file.originalname.split('.')[1]
    let cantInsert=[]
    try{
      if(extension=='res'){
    
        const allFileContents = fs.readFileSync(req.file.path, 'utf-8');
        const settings= await getsettings()
        const setting= settings[0].reservation.split('|')
        const organisme_length= parseInt(setting[0]) 
        const matricule_length=parseInt(setting[1]) +organisme_length

        const name_length=parseInt(setting[2]) +matricule_length
        const cin_char_length=parseInt(setting[3]) +name_length
        const cin_int_length=parseInt(setting[4]) +cin_char_length
        const code_length=parseInt(setting[5]) +cin_int_length
        const dossier_length=parseInt(setting[6]) +code_length
        const dure_length=parseInt(setting[7]) +dossier_length
        const mois_length=parseInt(setting[8]) +dure_length
        const imputation_length=parseInt(setting[9]) +mois_length
        const montant_length=parseInt(setting[10]) +imputation_length
        console.log(organisme_length,matricule_length,name_length,cin_int_length,cin_char_length,code_length,dossier_length,dossier_length,dure_length,mois_length,imputation_length,montant_length)


      
       await Promise.all( allFileContents.split(/\r?\n/).map( async function(line) {
            if(line==='') return
            const code_organisme=line.substring(0,organisme_length).trim();
            const matricule=line.substring(organisme_length,matricule_length).trim();
            const name=line.substring(matricule_length,name_length).trim();
            const cin=line.substring(name_length,cin_int_length).trim();
            const code=line.substring(cin_int_length,code_length).trim();
            const dossier=line.substring(code_length,dossier_length).trim();
            const dure=line.substring(dossier_length,dure_length).trim();
            const mois=line.substring(dure_length,mois_length).trim();
            const imputation=line.substring(mois_length,imputation_length).trim();
            const montant=line.substring(imputation_length,montant_length).trim();
  
            try{
               await insertReponseReservation(dure,mois,montant,dossier,matricule)
  
            }catch(e){
              console.log(e)
              cantInsert.push(line)
  
            }
            
          }))

          if(cantInsert.length > 0){

            req.flash('faildreponse','not all inserted')
          }else{
            req.flash('reponse','inserted seccesfuly')
          }
      
  
  
  
        insertfile(req.file.path,'res',req.session.userId)
        res.redirect('/reponse')
      }else{
    
        fs.unlinkSync(req.file.path)
        req.flash('faildreponse','extension should be .res')
      
        res.redirect('/reponse')
      }
  
    }catch(err){
  
      req.flash('faildreponse','file error')
  
      fs.unlinkSync(req.file.path)
      
      res.redirect('/reponse')
  
    }
  }catch(e){
    console.log(e)

  }




}
const downloadfile =async (req,res)=>{
    const namee=Date.now()
 
    const reser = await getConfirmation()
    if (reser.length > 0) {
      
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
         const ligne=l.code_organisme+'|'+l.code_revendeur+'|'+compatible(l.name,4)+'|'+idstr+'|'+compatible(idint,2)+'|'+compatible(l.matricule,1)+'|'+compatible(l.imputation,3)+'|'+'1'+'|'+l.dossier+'|0000000|0000000|0000000|0000000|000000|'+l.montant_credit+'|'+l.montant_credit+'|'+'0000'+'|'+compatible(l.montant_de_mensualite,1)+'|'+`${l.montant_credit/l.montant_de_mensualite}`+'|'+dateDebut+'|'+datefin
         console.log(ligne)
          return ligne;
      })
      
      var stream = fs.createWriteStream('./assets/download-conf/'+namee+'.pre', {flags:'a'});
      for(const stri of arrayy) {
        stream.write(stri+'\n')
       
      }

      stream.end();
       insertfile('./assets/download-conf/'+namee+'.pre','pre',req.session.userId)
       stream.on('finish', function () {
        // do stuff with the PDF file
        const filePath ='./assets/download-conf/'+namee+'.pre'
        inserted_confirmation()
  
        res.download(filePath)
      
    
      }) 
  
    }else{

      res.redirect('/reponse')
    }
   }




 

const writeAccept= async (re,res) => {
  const name=Date.now()
  const accept= await getAcceptREservation()
  if(accept.length > 0) {

    const ws = XLSX.utils.json_to_sheet(accept)
  
    const wb = XLSX.utils.book_new()
  
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
  
    XLSX.writeFile(wb, './assets/accept-reservation/'+name+'.xlsx')
    res.redirect('download/'+name)
  }else{

    res.redirect('/reponse')
  }


}

const dowloadAccept=(req,res) => {
  const name=req.params.id
  const id=req.params.id;
  const filePath = join(process.cwd(), '/assets/accept-reservation/'+name+'.xlsx')
  console.log(filePath)
  printedAccept()
  res.download(filePath)

}


const writeNotAccept = async (req,res) => {
  const name=Date.now()


  const Notaccept= await getNotAcceptReservation()
  if(Notaccept.length > 0) {

    const ws = XLSX.utils.json_to_sheet(Notaccept)
  
    const wb = XLSX.utils.book_new()
  
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
  
    XLSX.writeFile(wb, './assets/not-accept-reservation/'+name+'.xlsx')
    res.redirect('download/'+name)
  }else{
    res.redirect('/reponse')

  }

}

const dowloadNotAccept=(req,res) => {
  const name=req.params.id
  const id=req.params.id;
  const filePath = join(process.cwd(), '/assets/not-accept-reservation/'+name+'.xlsx')
  console.log(filePath)
  printedReject()
  res.download(filePath)
}

module.exports={
    read_reponse,
    downloadfile,
    writeAccept,
    dowloadAccept,
    writeNotAccept,
    dowloadNotAccept

}