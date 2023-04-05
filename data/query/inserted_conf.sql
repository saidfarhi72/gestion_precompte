UPDATE [dbo].[reservation]
SET
    [printed_confirmation] = 1
WHERE
   [printed_confirmation] = 0
