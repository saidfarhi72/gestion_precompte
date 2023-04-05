




 SELECT [code_organisme], [code_revendeur],[name],[cin],[dbo].[client].matricule,[imputation], [type_operation],[reponse_confirmation].[dossier],[montant_de_mensualite],[montant_credit]
FROM [dbo].[client]
INNER JOIN [dbo].[reservation]
 ON [dbo].[client].matricule=[dbo].[reservation].matricule
INNER JOIN [dbo].[reponse_confirmation]
 ON [dbo].[reservation].dossier=[dbo].[reponse_confirmation].dossier
WHERE  [reponse_confirmation].[code_retour]='00' and [reponse_confirmation].[matricule] =@matricule and [reponse_confirmation].[dossier] NOT IN(SELECT [dossier] FROM [dbo].[reponse_annulation]   WHERE  [reponse_annulation].[code_retour]='0'
 UNION  SELECT [dossier] FROM [dbo].[reponse_annulation_instance]   WHERE  [reponse_annulation_instance].[code_retour]='0') and [reponse_confirmation].[dossier]  not in (
SELECT dossier from [dbo].[precompte] l1 where exists (
SELECT dossier , max(moinsencr) as moinsencr FROM [dbo].[precompte]  l2 WHERE  l1.dossier=l2.dossier and l1.restpaye=0 GROUP by dossier HAVING  l1.moinsencr=max(moinsencr)) )
