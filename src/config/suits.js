/**
 * @openapi
 * /api/v1/getname:
 *      get:
 *          tags: [Widget]
 *          security:
 *              - bearerAuth : []
 *          description: Get the list of Names
 *          responses:
 *               200:
 *                    description: list of Names
 *               500:
 *                    description: Some Server Error
 *               401:
 *                    description: UnAuthorized Access. Kindly check Bearer Token
 */