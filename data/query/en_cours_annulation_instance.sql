UPDATE [dbo].[reponse_confirmation]
SET
    [en_cours_annulation_instance] = 1
WHERE
   [dossier] = @dossier 
