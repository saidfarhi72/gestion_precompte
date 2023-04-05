UPDATE [dbo].[reponse_confirmation]
SET
    [printed_reject] = 1
WHERE
   [printed_reject]=0
