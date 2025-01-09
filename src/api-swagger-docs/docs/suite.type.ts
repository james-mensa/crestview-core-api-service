/**
 * @openapi
 * /suite/type:
 *   post:
 *     summary: Add a new suite type
 *     tags:
 *       - Suite Types
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Suite images (uploaded files)
 *               price:
 *                 type: number
 *                 description: Price of the suite type
 *               tax:
 *                 type: number
 *                 description: Optional tax applied to the suite type
 *               name:
 *                 type: string
 *                 description: Name of the suite type
 *               description:
 *                 type: string
 *                 description: Detailed description of the suite type
 *               capacity:
 *                 type: object
 *                 properties:
 *                   adult:
 *                     type: integer
 *                     description: Number of adults the suite can accommodate
 *                   children:
 *                     type: integer
 *                     description: Number of children the suite can accommodate
 *               mattress:
 *                 type: string
 *                 description: Optional type of mattress provided in the suite
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of amenities available in the suite
 *     responses:
 *       200:
 *         description: Suite type added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ResponseType'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SuiteType'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all suite types
 *     tags:
 *       - Suite Types
 *     responses:
 *       200:
 *         description: Suite type list.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ResponseType'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SuiteType'
 *       500:
 *         description: Internal Server Error.
 * /suite/type/{id}:
 *   get:
 *     summary: Get a specific suite type
 *     tags:
 *       - Suite Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the suite type
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ResponseType'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SuiteType'
 *       404:
 *         description: Suite type not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a suite type
 *     tags:
 *       - Suite Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the suite type
 *     responses:
 *       200:
 *         description: Suite type deleted successfully
 *       404:
 *         description: Suite type not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a suite type
 *     tags:
 *       - Suite Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the suite type
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Suite images (uploaded files)
 *               price:
 *                 type: number
 *                 description: Price of the suite type
 *               tax:
 *                 type: number
 *                 description: Optional tax applied to the suite type
 *               name:
 *                 type: string
 *                 description: Name of the suite type
 *               description:
 *                 type: string
 *                 description: Detailed description of the suite type
 *               capacity:
 *                 type: object
 *                 properties:
 *                   adult:
 *                     type: integer
 *                     description: Number of adults the suite can accommodate
 *                   children:
 *                     type: integer
 *                     description: Number of children the suite can accommodate
 *               mattress:
 *                 type: string
 *                 description: Optional type of mattress provided in the suite
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of amenities available in the suite
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ResponseType'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SuiteType'
 *       404:
 *         description: Suite type not found
 *       500:
 *         description: Internal server error
 */
