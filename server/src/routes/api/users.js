import express from 'express';

import { users } from '../../controllers';

const router = express.Router();

router.post('/users', users.createUser);
router.get('/users/:permalink/statistics', users.readUserStatistics);

export default router;
