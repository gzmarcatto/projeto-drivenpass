import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { postNetworkSchema } from '@/schemas';
import { eraseNetwork, getNetwork, showNetwork, postNetwork } from '@/controllers';

const networksRouter = Router();

networksRouter.all('/*', authenticateToken);
networksRouter.get('/', getNetwork);
networksRouter.get('/:networkId', showNetwork);
networksRouter.post('/', validateBody(postNetworkSchema), postNetwork);
networksRouter.delete('/:networkId', eraseNetwork);

export { networksRouter };