

import { suiteTypeController } from '@controllers/suiteType.controller';
import {Router} from 'express'
import { uploadHelper } from 'src/lib/uploadHelper';

const suiteRouter=Router();
suiteRouter.route("/type").post(uploadHelper.array('images',10),suiteTypeController.add)

export default suiteRouter