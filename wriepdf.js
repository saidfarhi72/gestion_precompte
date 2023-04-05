const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const { getAnnulerByDossier, getIntituleByDossier, getOperbydossier } = require("./data/query");
const onFinished = require('on-finished')

 




const pdf= async (precompte,agent,name,res)=>{
    console.log(precompte)
    var etat=[]
    var anticipation=[] 
  await Promise.all(precompte.map( async (el)=>{

    var list=[]
    var list2=[]
    var compense= await getAnnulerByDossier(el.dossier)
    var intitule= await getIntituleByDossier(el.dossier)
    var operation= await getOperbydossier(el.dossier)
    console.log(compense)
    
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




      
    }else{

      list.push(`${(el.totalpre-el.restpaye)/100}`)
      list.push(el.restpaye/100)
    }
    list.push(el.montcomp/100)
    
    
    anticipation.push(list2)
    etat.push(list)
  })
  )








  var doc = new PDFDocument({ margin: 40, size: 'A4',compress:false });
  // save document
 const  writeStream= fs.createWriteStream(`./assets/pdf/${name}.pdf`)
  await doc.pipe(writeStream);
  

  await doc.image('./assets/logo6.jfif', 30, 20, {width: 100, height:100})


  await doc.image('./assets/logo10.jfif', 30, 700, {width: 280, height:120})



  await doc.image('./assets/logo7.jfif', 450, 20, {width: 110, height:110})



  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await doc.moveDown();
  await  doc.moveDown();





  await doc
  .font('Times-Roman')
  .fontSize(25)
  .text('Attestation de precompte',{
    width: 500,
    align: 'center'
    
  });
  await doc.moveDown();
  await doc.moveDown(); 

  
  await doc
  .font('Times-Roman')
  .fontSize(10)
  .text(`            Nom et Prenom :            ${agent[0].name}`,{
    width: 300,
    align: 'left'
  })
  await doc.moveDown();

  await doc
  .font('Times-Roman')
  .fontSize(10)
  .text(`            Numero C.I.N  :             ${agent[0].cin}`,{
    width: 300,
    align: 'left'
  })
  await doc.moveDown();

  await doc
  .font('Times-Roman')
  .fontSize(10)
  .text(`            Matricule PPR  :            ${agent[0].matricule}`,{
    width: 300,
    align: 'left'
  })
  await doc.moveDown();


  await doc.moveDown();

  await (async function createTable(){
    // table
    const table = {

        headers: [ "intitule","date debut", "date fin", "montant de la creance","mensualite","Dure(en mois)","prel_total","Reste","compense" ],
        rows: etat
      }

 
      // or columnsSize
      await doc.table(table, { 
        columnsSize: [ 50,70, 70, 50,50,50,50,50,50 ],
      
       
        
      });
   
  })()  
  await doc.moveDown();
  await doc
  .font('Times-Roman')
  .fontSize(12)
  .text('Anticipation',{
    width: 500,
    
  });
  await doc.moveDown();
  await (async function createTable1(){
    // table
    const table = {

        headers: ["intitule","date", "montant","motif"  ],
        rows: anticipation
      }

 
      // or columnsSize
      await doc.table(table, { 
        columnsSize: [80, 70,70, 120 ],
      
       
        
      });
      // done!
   
  })() 
  

  doc.end()

  writeStream.on('finish', function () {
    // do stuff with the PDF file
    const filePath = `./assets/pdf/${name}.pdf`
    res.download(filePath)
    onFinished(res, function (err, res) {
      fs.unlinkSync(filePath)
  
    })

  })


}


module.exports={
    pdf,
}