
const utils = require('../utils');


const { poolPromise,sql } = require('../../db');

const getsettings = async () => {
  try {
    let pool = await poolPromise ;

                  const reser = await pool.request().query('select * from settings');
                                          
                
                           return reser.recordset ;
                  } catch (error) {
                       console.log("you can't get settings");
}
}
const updateReservationsettings = async (reservation) => {
  try {
    let pool = await poolPromise ;


                  const reser = await pool.request()
                                          .input('resrvation', sql.NVarChar, reservation)

                                          .query('UPDATE [settings] SET [reservation] = @resrvation');
                                          
                
                           return reser.recordset ;
                  } catch (error) {
                       console.log("you can't get settings");
}
}

const getAgentByMatricule = async (matricule) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('matricule', sql.Int, matricule)
                                          .query(sqlQueries.getAgentByMtricule);
                
                           return reser.recordset ;
                  } catch (error) {
                       console.log("you can't get agent by matricule");
}
}
const getIntituleByDossier = async (dossier) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('dossier', sql.Int, dossier)
                                          .query('select [utilities] from reservation where dossier=@dossier');
                
                           return reser.recordset ;
                  } catch (error) {
                       console.log("you can't get agent by matricule");
}
}
const getOperbydossier= async (dossier) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('dossier', sql.Int, dossier)
                                          .query('select [operation],[remarque] from operation where dossier=@dossier');
                
                           return reser.recordset ;
                  } catch (error) {
                       console.log("you can't get agent by matricule");
}
}
          



  const getRes = async () => {
    try {
      let pool = await poolPromise ;
      
        const sqlQueries = await utils.loadSqlQueries('query');
        const reser = await pool.request().query(sqlQueries.res);
  
        return reser.recordset ;
    } catch (error) {
        console.log('eroooooooooooooooooooor11');
}}
const etat = async (matricule) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request().query(sqlQueries.etat);
           
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
                 }
}

    
    const getConfirmation = async () => {
        try {
          let pool = await poolPromise ;
          
            const sqlQueries = await utils.loadSqlQueries('query');
            const conf = await pool.request().query(sqlQueries.confirmation);
   
            return conf.recordset ;
        } catch (error) {
            console.log(error);
}}
const getAcceptREservation = async () => {
  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const conf = await pool.request().query(sqlQueries.getAcceptREservation);
          

      return conf.recordset ;
  } catch (error) {
      console.log(error);
}}
const getNotAcceptReservation = async () => {
  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const conf = await pool.request().query(sqlQueries.getNotAcceptReservation);
          

      return conf.recordset ;
  } catch (error) {
      console.log(error);
}}
const printedAccept= async ()=>{

  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const eventsList = await pool.request().query(sqlQueries.printedAccept);
          

      return ;
  } catch (error) {
      console.log('eroooooooooooooooooooor');
}}
const printedReject= async ()=>{

  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const eventsList = await pool.request().query(sqlQueries.printedReject);
          

      return ;
  } catch (error) {
      console.log('eroooooooooooooooooooor');
}}
const getNotAcceptconfirmation = async () => {
  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const conf = await pool.request().query(sqlQueries.getNotAcceptconfirmation);
          

      return conf.recordset ;
  } catch (error) {
      console.log(error);
}}
const printedNotAcceptConfirmation= async ()=>{

  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const eventsList = await pool.request().query(sqlQueries.printedNotAcceptConfirmation);
          

      return ;
  } catch (error) {
      console.log('eroooooooooooooooooooor');
}}


  


        
    

 const insertConfirmations = async (dossier,matricule,code_retour) => {
    try {
        // sql connection
        let pool = await poolPromise ;

          const transaction = new sql.Transaction(pool);
        try {
          await transaction.begin();
    
          const request = new sql.Request(transaction);
    
          const results = await Promise.all([
            await request.query(`insert into reponse_confirmation  (dossier,matricule,code_retour) values (${dossier},${matricule},'${code_retour}') `)
            ]);
    
          await transaction.commit();
 
        } catch (err) {
          await transaction.rollback();
          throw err;
        } 
      } catch (error) {
        throw error;
}
    
}

const insertOperation= async (dossier,user,operation,remarque) => {
  try {
      // sql connection
      let pool = await poolPromise ;

        const transaction = new sql.Transaction(pool);
      try {
        await transaction.begin();
  
        const request = new sql.Request(transaction);
  
        const results = await Promise.all([
          await request.query(`insert into [operation]  ([dossier], [user], [remarque],[operation])  values (${dossier},'${user}','${remarque.replace("'","''")}','${operation}') `) ]);
  
        await transaction.commit();

      } catch (err) {
        await transaction.rollback();
        throw err;
      } 
    } catch (error) {
      throw error;
}}      

const insertAgent = async (data) => {
      var code_org
      var code_rev
      if(data.code_org===undefined){
        code_org=4939
      }else{
        code_org=data.code_org

      }
      if(data.code_rev===undefined){
        code_rev='4939'
      }else{
        code_rev=`${data.code_rev}`

      }
    try {
        // sql connection
        let pool = await poolPromise ;

         const transaction = new sql.Transaction(pool);
        try {
          await transaction.begin();
    
          const request = new sql.Request(transaction);
    
          const results = await Promise.all([
            await request.query(`insert into client (code_organisme,code_revendeur,matricule,name,cin,imputation) values (${code_org},'${code_rev}',${data.matricule},'${data.name.trim().replace("'","''")}','${data.cin}',${data.imputation}) `)
            ]);
    
          await transaction.commit();
 

        } catch (err) {
          await transaction.rollback();
          
          throw err;
        } 
      } catch (error) {
        throw error;
      }          
    
}
const insertTrash = async (data,code) => {
      var code_org
      var code_rev
      if(data.code_org===undefined){
        code_org=4939
      }else{
        code_org=data.code_org

      }
      if(data.code_rev===undefined){
        code_rev='4939'
      }else{
        code_rev=`${data.code_rev}`

      }
  try {
   
      // sql connection
      let pool = await poolPromise ;

       const transaction = new sql.Transaction(pool);
      try {
        await transaction.begin();
  
        const request = new sql.Request(transaction);
  
        const results = await Promise.all([
          await request.query(`insert into trash (dossier,matricule,code_organisme,code_revendeur,name,cin,imputation,montant_de_mensualite,code) values (${data.dossier},${data.matricule},${code_org},'${code_rev}','${data.name.trim().replace("'","''")}','${data.cin}',${data.imputation},${data.montant},${code}) `)
          ]);
  
        await transaction.commit();


      } catch (err) {
        await transaction.rollback();
        
        throw err;
      } 
    } catch (error) {
      throw error;
    }          
  
}

const insertReservations = async (data,montant_credit,utilities)=> {

    try {
        // sql connection
        let pool = await poolPromise ;

        const transaction = new sql.Transaction(pool);
        try {
          await transaction.begin();
    
          const request = new sql.Request(transaction);
    
          const results = await Promise.all([
            await request.query(`insert into reservation (dossier,matricule,montant_de_mensualite,montant_credit,utilities) values (${data.dossier},${data.matricule},${data.montant},${montant_credit},'${utilities}' ) `)
            ]);
    
          await transaction.commit();
 
        } catch (err) {
          await transaction.rollback();
          throw err;
        } 
      } catch (error) {
        throw error;
      }        


    }


const insertReponseReservation= async (dure,mois,montant,dossier,matricule)=>{

    
    try {
        // sql connection
        let pool = await poolPromise ;

        const transaction = new sql.Transaction(pool);
        try {
          await transaction.begin();
    
          const request = new sql.Request(transaction);
    
          const results = await Promise.all([
           await  request.query(`insert into reponse_reservation (dossier,matricule,dure_de_pret,nombre_de_mois_differes,montant_TGR) values (${dossier},${matricule},${dure},${mois},${montant}) `)
            ]);
    
          await transaction.commit();
 
        } catch (err) {
          await transaction.rollback();
          throw err;
        } 
      } catch (error) {
        throw error;
      }         
   

}

const inserted_reservation= async ()=>{

    try {
      let pool = await poolPromise ;

        const sqlQueries = await utils.loadSqlQueries('query');
        const eventsList = await pool.request().query(sqlQueries.inserted_res);
  
        return ;
    } catch (error) {
        console.log('eroooooooooooooooooooor');
    }}


    const inserted_confirmation= async ()=>{

        try {
          let pool = await poolPromise ;

            const sqlQueries = await utils.loadSqlQueries('query');
            const eventsList = await pool.request().query(sqlQueries.inserted_conf);
   
            return ;
        } catch (error) {
            console.log('eroooooooooooooooooooor');


  }}
  const getOperation= async ()=>{

    try {
      let pool = await poolPromise ;

        const reser = await pool.request().query('SELECT * FROM [dbo].[operation] order BY [date] DESC');

        return reser.recordset ;
    } catch (error) {
        console.log('eroooooooooooooooooooor');


}}

        

    const getuser = async (email) => {
        try {
          let pool = await poolPromise ;
              const sqlQueries = await utils.loadSqlQueries('query');
              const reser = await pool.request()
                                        .input('email', sql.NVarChar, email)
                                        .query(sqlQueries.getuser);

                                        
                return reser.recordset ;
         } catch (error) {
                console.log(error);
         }}
    
       
    const matricule_Utilities= async (matricule,utilities) => {  
        try {
          let pool = await poolPromise ;

             const reser = await pool.request()
                                       .input('matricule', sql.Int, matricule)
                                       .input('utilities', sql.NVarChar, utilities)
                                       .query('select matricule from reservation where matricule=@matricule and utilities=@utilities');
                                       
          
       
              return reser.recordset ;
        } catch (error) {
               console.log('you cant  get matricle by matricule ');
        }


} 
    const matriculeClient= async (matricule) => {  
      try {
        let pool = await poolPromise ;

           const reser = await pool.request()
                                     .input('matricule', sql.Int, matricule)
                                     .query('select matricule from client where matricule=@matricule');
    
                                     
             return reser.recordset ;
      } catch (error) {
             console.log("you can;t get client by matricule ");
      }


}
const matriculeTrash= async (matricule) => {  
  try {
    let pool = await poolPromise ;

       const reser = await pool.request()
                                 .input('matricule', sql.Int, matricule)
                                 .query('select matricule from trash where matricule=@matricule');

                                 
         return reser.recordset ;
  } catch (error) {
         console.log("you can;t get trash by matricule ");
  }


}
const getTrash= async (code) => {  
  try {
    let pool = await poolPromise ;

       const reser = await pool.request()
                                  .input('code', sql.Int, code)
                                  .query('select [code_organisme],[code_revendeur], [dossier],[matricule],[cin],[name],[imputation] from trash where code=@code ');

                                 
         return reser.recordset ;
  } catch (error) {
         console.log("you can;t get trash by  ");
  }


}
const deleteTrash= async (code) => {  
  try {
    let pool = await poolPromise ;

       const reser = await pool.request()
                                  .input('code', sql.Int, code)
                                  .query('delete from trash where code=@code ');

                                 
         return reser.recordset ;
  } catch (error) {
         console.log("you can;t delete trash by  ");
  }


}
    
    
    const insertfile= async (path,extention,added_by)=>{

    
      let pool = await poolPromise ;

        const transaction = new sql.Transaction(pool)
        transaction.begin(err => {
        // ... error checks
    
        const request = new sql.Request(transaction)
        request.query(`insert into [file] (path,extension,added_by) values ('${path}','${extention}','${added_by}') `, (err, result) => {
            // ... error checks
    
            transaction.commit(err => {
               if(err){
                console.log(err);
               }
       
    
                console.log('commited')
            })
        })
    })
    
    }


  const en_cours_annualtion= async (dossier)=>{

        try {
          let pool = await poolPromise ;

            const sqlQueries = await utils.loadSqlQueries('query');
            const eventsList = await pool.request()
                                        .input('dossier', sql.Int, dossier)
                                        .query(sqlQueries.en_cours_annulation);
    
            return ;
        } catch (error) {
            console.log('eroor anullation');


}
}

const en_cours_annualtion_instance= async (dossier)=>{

  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const eventsList = await pool.request()
                                  .input('dossier', sql.Int, dossier)
                                  .query(sqlQueries.en_cours_annulation_instance);
          

      return ;
  } catch (error) {
      console.log('eroor anullation');


}
}
     const get_annulation = async () => {
            try {
              let pool = await poolPromise ;

                const sqlQueries = await utils.loadSqlQueries('query');
                const conf = await pool.request().query(sqlQueries.get_annulation);
       
                return conf.recordset ;
            } catch (error) {
                console.log(error);
}
}
const get_annulation_instance = async () => {
  try {
    let pool = await poolPromise ;
      const sqlQueries = await utils.loadSqlQueries('query');
      const conf = await pool.request().query(sqlQueries.get_annulation_instance);
          

      return conf.recordset ;
  } catch (error) {
      console.log(error);
  }}


const inserted_annulation= async ()=>{

     try {
      let pool = await poolPromise ;

         const sqlQueries = await utils.loadSqlQueries('query');
        const eventsList = await pool.request().query(sqlQueries.inserted_annulation);
  
            return ;
        } catch (error) {
            console.log('eroooooooooooooooooooor');
}
}
const inserted_annulation_instance= async ()=>{

  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
     const eventsList = await pool.request().query(sqlQueries.inserted_annulation_instance);
         

         return ;
     } catch (error) {
         console.log('eroooooooooooooooooooor');
}
}



 const insertReponseAnnulation= async (dossier,matricule,code_retour)=>{

    try {
        // sql connection
        let pool = await poolPromise ;

        const transaction = new sql.Transaction(pool);
        try {
          await transaction.begin();
    
          const request = new sql.Request(transaction);
    
          const results = await Promise.all([
              await request.query(`insert into [reponse_annulation] (dossier,matricule,code_retour) values (${dossier},${matricule},'${code_retour}') `)
            ]);
    
          await transaction.commit();
 
        } catch (err) {
          await transaction.rollback();
          throw err;
        } 
      } catch (error) {
        throw error;
      }            
}
const insertReponseAnnulationInstance= async (dossier,matricule,code_retour)=>{

    
                
  try {
      // sql connection
      let pool = await poolPromise ;

      const transaction = new sql.Transaction(pool);
      try {
        await transaction.begin();
  
        const request = new sql.Request(transaction);
  
        const results = await Promise.all([
            await request.query(`insert into [reponse_annulation_instance] (dossier,matricule,code_retour) values (${dossier},${matricule},'${code_retour}') `)
          ]);
  
        await transaction.commit();
  
      } catch (err) {
        await transaction.rollback();
        throw err;
      } 
    } catch (error) {
      throw error;
    }            
}

            
            
    
    const client_finel = async () => {
        try {
          let pool = await poolPromise ;

            const sqlQueries = await utils.loadSqlQueries('query');
            const reser = await pool.request().query(sqlQueries.client_final);
   
                                                
                    return reser.recordset ;
            } catch (error) {
                    console.log('eroooooooooooooooooooor11');
            }}
    

const getClientByDossier = async (dossier) => {
    try {
      let pool = await poolPromise ;

        const sqlQueries = await utils.loadSqlQueries('query');
        const reser = await pool.request()
                                .input('dossier', sql.Int, dossier)
                                .query(sqlQueries.getClientByDossier);
  
                                                
                 return reser.recordset ;
        } catch (error) {
             console.log('eroooooooooooooooooooor11');
}
}

const getClientByMatricule = async (matricule) => {
  try {
    let pool = await poolPromise ;

      const sqlQueries = await utils.loadSqlQueries('query');
      const reser = await pool.request()
                              .input('matricule', sql.Int, matricule)
                              .query(sqlQueries.getClientByMatricule);

                                              
               return reser.recordset ;
      } catch (error) {
           console.log('eroooooooooooooooooooor11');
}
}




    const insertprecompte = async (data) => {

      const formatdate= (date)=>{
        if(date.length>0){
          const split=date.split('-');
          return split[1]+'-'+split[0]+'-'+split[2]
  

        } 
        return '';
       
      }

        try {
          // sql connection
          let pool = await poolPromise ;

          const transaction = new sql.Transaction(pool);
          try {
            await transaction.begin();
      
            const request = new sql.Request(transaction);
            if(data[13]==''){
              const results = await Promise.all([
                await request.query(`insert into precompte (dossier,matricule,code_organisme,imputation,datdebet,datefinet,totalpre,restpaye,menspret,cumulpre,montcomp,etatpret,motifrad,moinsencr) values ('${data[3]}',${data[0]},${data[1]},'${data[2]}','${formatdate(data[4])}','${formatdate(data[5])}',${data[6]},${data[7]},${data[8]},${data[9]},${data[10]},'${data[11]}','${data[12]}','${formatdate(data[14])}') `)
            ]);

            }else{
      
            const results = await Promise.all([
                await request.query(`insert into precompte (dossier,matricule,code_organisme,imputation,datdebet,datefinet,totalpre,restpaye,menspret,cumulpre,montcomp,etatpret,motifrad,dteffrad,moinsencr) values ('${data[3]}',${data[0]},${data[1]},'${data[2]}','${formatdate(data[4])}','${formatdate(data[5])}',${data[6]},${data[7]},${data[8]},${data[9]},${data[10]},'${data[11]}','${data[12]}','${formatdate(data[13])}','${formatdate(data[14])}') `)
            ]);
          }
   
      
            await transaction.commit();
          } catch (err) {
            await transaction.rollback();
            throw err;
          } 
        } catch (error) {
          throw error;
        }
      }



    const getsuivi = async () => {
        try {
          let pool = await poolPromise ;

            const sqlQueries = await utils.loadSqlQueries('query');
            const reser = await pool.request().query(sqlQueries.getsuivi);
   
            return reser.recordset ;
        } catch (error) {
            console.log('eroooooooooooooooooooor11');
        }}

const getprecpmpteByDossier = async (dossier) => {
            try {
              let pool = await poolPromise ;

                const sqlQueries = await utils.loadSqlQueries('query');
                const reser = await pool.request()
                                        .input('dossier', sql.NVarChar, dossier)
                                        .query(sqlQueries.getprecompteByDossier);
                                        
       
                                                        
                         return reser.recordset ;
                } catch (error) {
                     console.log('eroooooooooooooooooooor11');
                }}
        

 const getprecompteBYmatricule = async (matricule) => {
        try {
          let pool = await poolPromise ;

                        const sqlQueries = await utils.loadSqlQueries('query');
                        const reser = await pool.request()
                                                .input('matricule', sql.Int, matricule)

                                                .query(sqlQueries.getprecompteByMatricule);
               
                                                                
                                 return reser.recordset ;
                        } catch (error) {
                             console.log('eroooooooooooooooooooor11');
                       }
}
const getIntitule = async (matricule) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request().query(sqlQueries.getIntitule);
         
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
}}
const max_dossier = async () => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request().query('SELECT max([dossier]) as max_dossier from [reservation] ');
         
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
}}
const getAttestation = async (matricule) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('matricule', sql.Int, matricule)
                                          .query(sqlQueries.getAttestation);
           
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
                 }
}
const getAnnulerByDossier = async (dossier) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('dossier', sql.Int, dossier)
                                          .query(sqlQueries.getAnnulerByDossier);
       
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
                 }
}
const getEncoursAnnulationByDossier = async (dossier) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('dossier', sql.Int, dossier)
                                          .query(' select * from annulation where dossier =@dossier');
       
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
                 }
}
const getEncoursAnnulationInstanceByDossier = async (dossier) => {
  try {
    let pool = await poolPromise ;

                  const sqlQueries = await utils.loadSqlQueries('query');
                  const reser = await pool.request()
                                          .input('dossier', sql.Int, dossier)
                                          .query(' select * from [reponse_confirmation] where [en_cours_annulation_instance]=1 and dossier =@dossier');
       
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
                 }
}
const getOperationByDossier = async (dossier) => {
  try {
    let pool = await poolPromise ;

                  const reser = await pool.request()
                                          .input('dossier', sql.Int, dossier)
                                          .query('select * from operation where dossier=@dossier');
       
                                                          
                           return reser.recordset ;
                  } catch (error) {
                       console.log('eroooooooooooooooooooor11');
                 }
}
const insertAnnulation= async (attestation,dossier,raison)=>{

    
                
  try {
      // sql connection
      let pool = await poolPromise ;

      const transaction = new sql.Transaction(pool);
      try {
        await transaction.begin();
  
        const request = new sql.Request(transaction);
  
        const results = await Promise.all([
            await request.query(`insert into [annulation] (dossier,attestation,raison) values (${dossier},'${attestation}','${raison}') `)
          ]);
 
  
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw err;
      } 
    } catch (error) {
      throw error;
    } 
               
}
          
                




                        

    module.exports = {
      getAgentByMatricule,
        getRes,
        insertAgent,
        matriculeClient,
        insertConfirmations,
        insertReservations,
        insertReponseReservation,
        inserted_reservation,
        inserted_confirmation,
        getConfirmation,
        getuser,
        matricule_Utilities,
        insertfile,
        en_cours_annualtion,
        get_annulation,
        client_finel,
        getClientByDossier,
        inserted_annulation,
        insertReponseAnnulation,
        insertprecompte,
        getsuivi,
        getprecpmpteByDossier,
        getprecompteBYmatricule,
        getIntitule,
        getAcceptREservation,
        getNotAcceptReservation,
        printedAccept,
        printedReject,
        getAttestation,
        insertAnnulation,
        get_annulation_instance,
        inserted_annulation_instance,
        en_cours_annualtion_instance,
        insertReponseAnnulationInstance,
        getAnnulerByDossier,
        insertTrash,
        matriculeTrash,
        getTrash,
        deleteTrash,
        insertOperation,
        getNotAcceptconfirmation,
        printedNotAcceptConfirmation,
        getOperation,
     getOperationByDossier ,
     getEncoursAnnulationByDossier,
     getEncoursAnnulationInstanceByDossier,
     getClientByMatricule,
     max_dossier,
     getIntituleByDossier,
     getOperbydossier,
     etat,
     getsettings,
     updateReservationsettings

          
    }