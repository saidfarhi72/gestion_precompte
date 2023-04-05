SELECT [code_organisme], [code_revendeur],[name],[cin],[dbo].[client].matricule,[imputation],[reponse_reservation].[dossier],[montant_de_mensualite],[montant_credit]
FROM [dbo].[client]
INNER JOIN [dbo].[reservation]
 ON [dbo].[client].matricule=[dbo].[reservation].matricule
INNER join [dbo].[reponse_reservation]
ON [dbo].[reservation].dossier=[dbo].[reponse_reservation].dossier
 WHERE printed_accept=0 and [reponse_reservation].montant_TGR>=[reservation].montant_de_mensualite
