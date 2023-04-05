const fs = require('fs')
const {join} = require('path');
const { insertprecompte, executeProcedure, getprecompteBYmatricule } = require('../data/query');




const read_suivi=async  (req,res)=>{
    const extension=req.file.originalname.split('.')[1]
    try{
      if(extension=='tot'){
        
        let dont=[]
        let elredy=[]
        const allFileContents = fs.readFileSync(req.file.path, 'utf-8').split(/\r?\n/);
        console.log(allFileContents.length)
      
         await Promise.all(allFileContents.map(async  function(l,index) {
            if(l==='') return
            
            const line = l.split('|')
            const precompte = await getprecompteBYmatricule(line[0],line[14])

              try{
  
                 await insertprecompte(line)
  
              }catch(err){
                console.log(err)
                dont.push(line[3])
              }
            
      

              

          
        }))

        
        console.log('exsit',elredy)
        console.log('dont',dont)

        
        if(dont.length>0){
          req.flash('not inserted ',dont.join('/////  /////'));


        }else{
          req.flash('inserte','succes');


        }
  
  
  
        res.redirect('/suivi/upload')
      }else{

        fs.unlinkSync(req.file.path)
        req.flash('file','extension should be .tot')
      
        res.redirect('/suivi/upload')
      }
  
    }catch(err){
      console.log(err)
    

  
      req.flash('file','file error')
  
      fs.unlinkSync(req.file.path)
      
      res.redirect('/suivi/upload')
  
    }
  

  
  
  
  }

  module.exports={
    read_suivi

  }