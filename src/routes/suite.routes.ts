

import { suiteTypeController } from '@controllers/suiteType.controller';
import express from 'express'
import { uploadHelper } from '@lib/uploadHelper';
import { roomController } from '@controllers/room.controller';
const router = express.Router();

router.post('/suite/type',uploadHelper.array('images',10),suiteTypeController.add);
router.get('/suite/type',suiteTypeController.getAll);
router.get('/suite/type/:id',suiteTypeController.getOne);
router.delete('/suite/type/:id',suiteTypeController.delete);
router.put('/suite/type/:id',suiteTypeController.update);

// room route
router.post('/suite/room',roomController.add);
router.get('/suite/room',roomController.add);
router.get('/suite/room/:id',roomController.add);
router.delete('/suite/room/:id',roomController.add);
router.put('/suite/room/:id',roomController.add);
export default router;