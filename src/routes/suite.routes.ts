

import { suiteTypeController } from '@controllers/suiteType.controller';
import {Router} from 'express'
import { uploadHelper } from 'src/lib/uploadHelper';

const suiteRouter=Router();
suiteRouter.route('/type').post(uploadHelper.array('images',10),suiteTypeController.add);
suiteRouter.route('/type').get(suiteTypeController.getAll);
suiteRouter.route('/type/:id').get(suiteTypeController.getOne);
suiteRouter.route('/type/:id').delete(suiteTypeController.delete);
suiteRouter.route('/type/:id').put(suiteTypeController.update);
export default suiteRouter;