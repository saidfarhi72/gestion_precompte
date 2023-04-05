UPDATE [dbo].[reponse_confirmation]
SET
    [printed_annulation_instance] = 1
WHERE
   [printed_annulation_instance] = 0 AND [en_cours_annulation_instance]=1
