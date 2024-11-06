import { getHealthStatus } from '@services/healthCheck.service';
import {Router} from 'express'

const healthRouter=Router();
healthRouter.route("/health").get(getHealthStatus)

export default healthRouter