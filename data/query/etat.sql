
SELECT [sum_pre],[sum_credit],[sum_antici] ,T3.utilities from(

SELECT SUM(totalpre) -SUM(restpaye) as sum_pre ,utilities  from [dbo].[precompte] l1
INNER join reservation
ON reservation.dossier=l1.dossier
where exists (

SELECT dossier , max(moinsencr) as moinsencr FROM [dbo].[precompte]  l2

WHERE  l1.dossier=l2.dossier 

GROUP by dossier 
HAVING  l1.moinsencr=max(moinsencr)
) 
GROUP BY utilities
) as T1
LEFT JOIN (


SELECT SUM(restpaye) sum_antici,utilities from [dbo].[precompte] l1
INNER join reservation
ON reservation.dossier=l1.dossier
INNER JOIN reponse_annulation
ON
reponse_annulation.dossier=l1.dossier
where exists (

SELECT dossier , max(moinsencr) as moinsencr FROM [dbo].[precompte]  l2

WHERE  l1.dossier=l2.dossier 

GROUP by dossier 
HAVING  l1.moinsencr=max(moinsencr)
) 
GROUP BY utilities
)as T2
on T1.utilities=T2.utilities

right JOIN(
    SELECT SUM(montant_credit) as sum_credit ,utilities  from [dbo].[reservation]
 
GROUP BY utilities
) as T3
on T1.utilities=T3.utilities
