SELECT [code_organisme], [code_revendeur],[name],[cin],[dbo].[client].matricule,[imputation],[reservation].[dossier],[montant_de_mensualite],[montant_credit],[reponse_reservation].[date]
FROM [dbo].[client]
INNER JOIN [dbo].[reservation]
 ON [dbo].[client].matricule=[dbo].[reservation].matricule
INNER JOIN [dbo].[reponse_confirmation]
 ON [dbo].[reservation].dossier=[dbo].[reponse_confirmation].dossier
INNER JOIN [dbo].[reponse_reservation]
 ON [dbo].[reponse_reservation].dossier=[dbo].[reponse_confirmation].dossier

WHERE  [en_cours_annulation_instance] = 1 and [printed_annulation_instance]=0