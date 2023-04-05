UPDATE [dbo].[reponse_confirmation]
SET
    [annuler] = 1
WHERE
   [dossier] = @dossier 
