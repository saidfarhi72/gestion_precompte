UPDATE [dbo].[reponse_confirmation]
SET
    [printed_annulation] = 1
WHERE
   [printed_annulation] = 0 AND [en_cours_annulation]=1
