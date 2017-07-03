import express from 'express';

import search from './search';
import users from './users';

const router = express.Router();

router.use('/api', search);
router.use('/api', users);

export default router;
