UPDATE [dbo].[reponse_confirmation]
SET
    [en_cours_annulation] = 1
WHERE
   [dossier] = @dossier 
