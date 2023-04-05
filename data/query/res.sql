SELECT [code_organisme], [code_revendeur],[name],[cin],[dbo].[client].matricule,[imputation], [type_operation],[dossier],[montant_de_mensualite]
FROM [dbo].[client]
INNER JOIN [dbo].[reservation]
 ON [dbo].[client].matricule=[dbo].[reservation].matricule
 WHERE printed_reservation=0