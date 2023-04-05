const fs = require('fs')
const {array} = require('../helper')
const xlsx=require('xlsx')

const {join} = require('path');
const { insertAgent, insertReservations, getRes, inserted_reservation, getWithId,  insertfile, matricule_Utilities, matriculeClient, insertTrash, matriculeTrash, getTrash, getTrashDublicated, deleteTrash,  } = require('../data/query');
const { get } = require('http');
const onFinished = require('on-finished')

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
  
const reservation =  async (req,res) => {
    const reser=await getRes()
    if( reser.length > 0 ){
        
    const namee=Date.now()
    const arrayy=reser.map((l)=>{

        
        const id=l.cin.match(/(\d+)/)
        const idint=id[0]
        const idstr=l.cin.replace(id[0],'')
        const ligne=l.code_organisme+'|'+l.code_revendeur+'|'+compatible(l.name,4)+'|'+idstr+'|'+compatible(idint,2)+'|'+compatible(l.matricule,1)+'|'+compatible(l.imputation,3)+'|'+l.type_operation+'|'+l.dossier+'|0000000|0000000|0000000|0000000|0000000|'+compatible(l.montant_de_mensualite,1)
        
      

        
        return ligne
    })
    var stream = fs.createWriteStream('./assets/download-res/'+namee+'.con', {flags:'a'});
    for(const stri of arrayy) {
        stream.write(stri+'\n')
     
       

    }
    insertfile('./assets/download-res/'+namee+'.con','con',req.session.userId)

    stream.end()
    stream.on('finish', function () {
      // do stuff with the PDF file
      const filePath ='./assets/download-res/'+namee+'.con'
      inserted_reservation()
      res.download(filePath)


    
  
    })    
   }else{

       res.redirect('/reservation')
   }



}





const readFile = async (req, res) =>{
    try{

        const extension=req.file.originalname.split('.')[1]
        if(extension=='xlsx'){
            const montant_credit=req.body.montant_credit;
            var utilities
            if(req.body.check){
                 utilities=req.body.addutilities
            }else {
                utilities=req.body.utilities

            }
            if(utilities==''){
              req.flash('intitule',"il faut definir l'intitule")

              res.redirect('/reservation')
            }else{

    
            const data = await xlsx.readFile(req.file.path);
            
            const worksheet = data.Sheets[data.SheetNames[0]];
            const excelData=xlsx.utils.sheet_to_json(worksheet)
            console.log("excel length",excelData.length)
            
            
            const arrayMtricule= excelData.map((item) => {
                return item.matricule
              })
              const setMatricule = new Set(arrayMtricule);
            
              const duplMAtricule = arrayMtricule.filter(item => {
                if (setMatricule.has(item)) {
                    setMatricule.delete(item);
                } else {
                    return item;
                }
            })
            
            const duplMAtriculeset=new Set(duplMAtricule)
            
            
            const filtred = excelData.filter(item => {
              if (duplMAtriculeset.has(item.matricule)) {
                setMatricule.delete(item);
              } else {
                  return item;
                }
              });
              const filtOut = excelData.filter(item => {
                if (duplMAtriculeset.has(item.matricule)) {
                  return item;
                } else {
                  setMatricule.delete(item);
                  
                  }
                });

            console.log('unique',filtred)
            console.log('duplicated',filtOut)


            

            await insertfile(req.file.path,'excel',req.session.userId)
            let notInsertedres=[]
            let elreadyExistres=[]
            let notinsertedclit=[]
            let elreadyExistcli=[]
            let notinsert=[]
            console.log(filtred.length)

            console.log(excelData.length)
            
            await Promise.all(filtred.map( async (el,index) =>{
                try{

                    let matricule_utilities = await matricule_Utilities(el.matricule,utilities)
                    if(matricule_utilities.length > 0){
                        elreadyExistres.push(el)
                        
                    }else {
                            try{
    
                                let matricule = await matriculeClient(el.matricule,index)
                                if(matricule.length > 0){
                                    elreadyExistcli.push(el)  
                                }else{
                                    
                                try{
                                    await insertAgent(el);
        
                                }catch(e){
                                    notinsertedclit.push(el)
                                    notinsert.push(el.matricule)
                                }
        
                                }
                                 
                                await insertReservations(el,montant_credit,utilities);
                                
                            }catch{
                                notInsertedres.push(el);
                            }
                            
                    }
                }catch(e){
                    console.log('you cant insert ')
                    
                }
                
            }))

            let trash = []

            //insert duplicated agent to trash with code=0
            if(filtOut.length > 0){

                await Promise.all(filtOut.map( async (el,index) =>{
                    try{
    
                        let matricule = await matriculeTrash(el.matricule)
                        if(matricule.length > 0){
                            trash.push(el)
                            
                            }
                            else {
                              await insertTrash(el,0);
            
                             }    
                        
                    }catch(e){
                        console.log('you cant insert ')
                        
                    }
                    
                }))
            }
            //insert elready exsit reservation to trash with code = 1
            if(elreadyExistres.length > 0){

                await Promise.all(elreadyExistres.map( async (el,index) =>{
                    try{
    
                        let matricule = await matriculeTrash(el.matricule)
                        if(matricule.length > 0){
                            trash.push(el)
                            
                            }
                            else {
                              await insertTrash(el,1);
            
                             }    
                        
                    }catch(e){
                        console.log('you cant insert ')
                        
                    }
                    
                }))
            }

            //insert not inserted reservation to trash with code=2
            if(notInsertedres.length > 0){

                await Promise.all(notInsertedres.map( async (el,index) =>{
                    try{
    
                        let matricule = await matriculeTrash(el.matricule)
                        if(matricule.length > 0){
                            trash.push(el)
                            
                            }
                            else {
                              await insertTrash(el,2);
            
                             }    
                        
                    }catch(e){
                        console.log('you cant insert ')
                        
                    }
                    
                }))
            }
            //insert not inserted reservation to trash with code=3

            if(notinsertedclit.length > 0){

   
      
      
 

                await Promise.all(notinsertedclit.map( async (el,index) =>{
                    try{
    
                        let matricule = await matriculeTrash(el.matricule)
                        if(matricule.length > 0){
                            trash.push(el)
                            
                            }
                            else {
                              await insertTrash(el,3);
            
                             }    
                        
                    }catch(e){
                        console.log('you cant insert ')
                        
                    }
                    
                }))
            }
        console.log('trash ', trash)
              
        if(notInsertedres.length==0){
            req.flash('inserted','inserted successfully');
  
  
          }
            
          
          console.log('client already exisct',elreadyExistcli)
          
          console.log('not inserted reservation',notInsertedres )
          
          console.log('alredy xist res',elreadyExistres)
          console.log(utilities)
          console.log('not inserted client ',notinsertedclit)
          if(notinsert.length>0){

            req.flash('not client',notinsert.join('/////  /////'));
          }

            res.redirect('/reservation')
    
       } }else{
            req.flash('file','extension should be .xlsx')
            fs.unlinkSync(req.file.path)
            res.redirect('/reservation')
        }
    }catch(e){
        console.log(e)
            req.flash('file','file error')
            fs.unlinkSync(req.file.path)
            res.redirect('/reservation')

    }



}





const writeDuplcated = async (req,res) => {
    const name=Date.now()
  
  
    const duplected= await getTrash(0)
    if(duplected.length > 0) {
  
      const ws = xlsx.utils.json_to_sheet(duplected)
    
      const wb = xlsx.utils.book_new()
    
      xlsx.utils.book_append_sheet(wb, ws, 'Responses')
    
      xlsx.writeFile(wb, './assets/trash/'+'duplicated'+name+'.xlsx')
      res.redirect('download/'+name)
    }else{
      res.redirect('/reservation')
  
    }
  
  }
  
  const dowloadDuplcated= async(req,res,next) => {
    const name=req.params.id
    const filePath = join(process.cwd(), '/assets/trash/'+'duplicated'+name+'.xlsx')
    console.log(filePath)
    deleteTrash(0)

    res.download(filePath)
  
    onFinished(res, function (err, res) {
      fs.unlinkSync(filePath)

    })

  }
 
  
  const writeElredyRes = async (req,res) => {
    const name=Date.now()
  
  
    const elredy= await getTrash(1)
    if(elredy.length > 0) {
  
      const ws = xlsx.utils.json_to_sheet(elredy)
    
      const wb = xlsx.utils.book_new()
    
      xlsx.utils.book_append_sheet(wb, ws, 'Responses')
    
      xlsx.writeFile(wb, './assets/trash/'+'exsitrasi'+name+'.xlsx')
      res.redirect('download/'+name)
    }else{
      res.redirect('/reservation')
  
    }
  
  }
  
  
  const dowloadElredyRes=(req,res) => {
      const name=req.params.id
      const filePath = join(process.cwd(), '/assets/trash/'+'exsitrasi'+name+'.xlsx')
      console.log(filePath)
      deleteTrash(1)
      res.download(filePath)
        
    onFinished(res, function (err, res) {
      fs.unlinkSync(filePath)

    })
    }
    
    



    const writenotINsertedRes = async (req,res) => {
      const name=Date.now()
    
    
      const notInsert= await getTrash(2)
      if(notInsert.length > 0) {
    
        const ws = xlsx.utils.json_to_sheet(notInsert)
      
        const wb = xlsx.utils.book_new()
      
        xlsx.utils.book_append_sheet(wb, ws, 'Responses')
      
        xlsx.writeFile(wb, './assets/trash/'+'reservfaild'+name+'.xlsx')
        res.redirect('download/'+name)
      }else{
        res.redirect('/reservation')
    
      }
    
    }

    const dowloadnotINsertedRes=(req,res) => {
        const name=req.params.id
        const filePath = join(process.cwd(), '/assets/trash/'+'reservfaild'+name+'.xlsx')
        console.log(filePath)
        deleteTrash(2)
        res.download(filePath)
          
    onFinished(res, function (err, res) {
      fs.unlinkSync(filePath)

    })
}


const writeNotInsertClient = async (req,res) => {
    const name=Date.now()
  
  
    const notInsert= await getTrash(3)
    if(notInsert.length > 0) {
  
      const ws = xlsx.utils.json_to_sheet(notInsert)
    
      const wb = xlsx.utils.book_new()
    
      xlsx.utils.book_append_sheet(wb, ws, 'Responses')
    
      xlsx.writeFile(wb, './assets/trash/'+'clientNotInsert'+name+'.xlsx')
      res.redirect('download/'+name)
    }else{
      res.redirect('/reservation')
  
    }
  
  }

  const dowloadNotInsertClient=(req,res) => {
      const name=req.params.id
      const filePath = join(process.cwd(), '/assets/trash/'+'clientNotInsert'+name+'.xlsx')
      console.log(filePath)
      deleteTrash(3)
      res.download(filePath)
        
    onFinished(res, function (err, res) {
      fs.unlinkSync(filePath)

    })
    }
    



module.exports ={
    reservation,
    readFile,
    writeDuplcated,
    dowloadDuplcated,
    writeElredyRes,
    dowloadElredyRes,
    dowloadNotInsertClient,
    writeNotInsertClient,
    dowloadnotINsertedRes,
    writenotINsertedRes,

    
 
}
