
SELECT * from [dbo].[precompte] l1
where exists (

SELECT dossier , max(moinsencr) as moinsencr FROM [dbo].[precompte]  l2

WHERE matricule=@matricule and l1.dossier=l2.dossier 
GROUP by dossier 
HAVING  l1.moinsencr=max(moinsencr)
) 