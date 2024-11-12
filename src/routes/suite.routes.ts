

import { suiteTypeController } from '@controllers/suiteType.controller';
import {Router} from 'express'

const suiteRouter=Router();
suiteRouter.route("/type").post(suiteTypeController.add)

export default suiteRouter