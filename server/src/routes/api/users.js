import express from 'express';

import { users } from '../../controllers';

const router = express.Router();

router.post('/users', users.createUser);

export default router;
