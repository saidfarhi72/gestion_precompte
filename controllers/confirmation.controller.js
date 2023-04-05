const fs = require('fs-extra');
const { insertConfirmations, getNotAcceptconfirmation, printedAcceptConfirmation, printedNotAcceptConfirmation, insertfile, getsettings } = require('../data/query');
const xlsx = require('xlsx');
const { join } = require('path');


const read_confirmation= async(req,res)=>{
    const extension=req.file.originalname.split('.')[1]
    var dont=[]
    try{

      if(extension=='rep'){
    
        const allFileContents = fs.readFileSync(req.file.path, 'utf-8');
        const settings= await getsettings()
        const setting= settings[0].reservation.split('|')
        const organisme_length= parseInt(setting[0]) 
        const name_length=parseInt(setting[2]) +organisme_length
        const cin_char_length=parseInt(setting[3]) +name_length
        
        const cin_int_length=parseInt(setting[4]) +cin_char_length
        const matricule_length=parseInt(setting[1]) +cin_int_length
        const imputation_length=parseInt(setting[9]) +matricule_length
        const dossier_length=parseInt(setting[6]) +imputation_length
        const code_length=parseInt(setting[5]) +dossier_length
        console.log(organisme_length,name_length,cin_int_length,matricule_length,imputation_length,dossier_length,code_length)
      
          await Promise.all(allFileContents.split(/\r?\n/).map( async function(line) {
              if(line==='') return
              const code_organisme=line.substring(0,organisme_length).trim();
              const name=line.substring(organisme_length,name_length).trim();
              const cin=line.substring(name_length,cin_int_length).trim();
              const matricule=line.substring(cin_int_length,matricule_length).trim();
              const imputation=line.substring(matricule_length,imputation_length).trim();
              const dossier=line.substring(imputation_length,dossier_length).trim();
              const code_retour=line.substring(dossier_length,code_length).trim();
              try{
                await insertConfirmations(dossier,matricule,code_retour)

              }catch(e){
                dont.push(dossier)


              }
              
              
              
              
            }))
 
            console.log('can not be inset', dont)
      }else{
        fs.unlinkSync(req.file.path)
        req.flash('fileconf','extension should be .res')

        res.redirect('/confirmation')
    
    
      }
      if(dont.length > 0){
        
        req.flash('not inserted conf',dont.join('/////  /////'));
        
      }else{
        req.flash('succesconfirmation','all inserted successfully')

      }
      insertfile(req.file.path,'rep',req.session.userId)
      res.redirect('/confirmation')

    }catch(err){
      console.log(err)

      fs.unlinkSync(req.file.path)
        req.flash('fileconf','file error')

        res.redirect('/confirmation')

    }


}


const writeNotAcceptConfirmation = async (req,res) => {
  const name=Date.now()


  const Notaccept= await getNotAcceptconfirmation()
  console.log(Notaccept)
  if(Notaccept.length > 0) {

    const ws = xlsx.utils.json_to_sheet(Notaccept)
  
    const wb = xlsx.utils.book_new()
  
    xlsx.utils.book_append_sheet(wb, ws, 'Responses')
  
    xlsx.writeFile(wb, './assets/not-accept-confirmation/not-accept-'+name+'.xlsx')
    res.redirect('download/'+name)
  }else{
    res.redirect('/confirmation')

  }

}

const dowloadNotAcceptConfirmation=(req,res) => {
  const name=req.params.id
  const id=req.params.id;
  const filePath = join(process.cwd(), '/assets/not-accept-confirmation/not-accept-'+name+'.xlsx')
  console.log(filePath)

  res.download(filePath)
  printedNotAcceptConfirmation()
}



module.exports ={
    read_confirmation,
    writeNotAcceptConfirmation,
    dowloadNotAcceptConfirmation
}
