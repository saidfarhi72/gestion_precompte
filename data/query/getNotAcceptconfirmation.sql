
 SELECT [cin],[name],[client].[matricule],[dossier],[code_retour]
FROM [dbo].[client]
INNER JOIN [dbo].[reponse_confirmation]
 ON [dbo].[reponse_confirmation].matricule=[dbo].[client].matricule

 where [code_retour]!='0' and [printed_reject]=0