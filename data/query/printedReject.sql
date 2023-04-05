UPDATE [dbo].[reponse_reservation]
SET
    [printed_reject] = 1
WHERE
   [printed_reject]=0
