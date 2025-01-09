/**
 * @swagger
 * components:
 *   schemas:
 *     ResponseType:
 *       type: object
 *       properties:
 *         errorMessage:
 *           type: string
 *           nullable: true
 *         message:
 *           type: string
 *           nullable: true
 *         data:
 *           nullable: true
 *           oneOf:
 *             - type: object
 *             - type: array
 *               items:
 *                 type: object
 *     SuiteType:
 *       type: object
 *       required:
 *         - images
 *         - price
 *         - name
 *         - description
 *         - capacity
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         images:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Image'
 *         price:
 *           type: number
 *         tax:
 *           type: number
 *           nullable: true
 *         name:
 *           type: string
 *         rating:
 *           type: number
 *           nullable: true
 *         description:
 *           type: string
 *         capacity:
 *           type: object
 *           properties:
 *             adult:
 *               type: integer
 *             children:
 *               type: integer
 *         mattress:
 *           type: string
 *           nullable: true
 *         amenities:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *         rooms:
 *           type: object
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Suite:
 *       type: object
 *       required:
 *         - suiteType
 *         - roomNumber
 *       properties:
 *         booking:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *             format: uuid
 *         suiteType:
 *           type: string
 *           format: uuid
 *         roomNumber:
 *           type: string
 *     Image:
 *       type: object
 *       required:
 *         - file
 *       properties:
 *         file:
 *           type: string
 *         suiteType:
 *           type: string
 *           format: uuid
 */
