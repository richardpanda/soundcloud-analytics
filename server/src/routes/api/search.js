import express from 'express';

import { search } from '../../controllers';

const router = express.Router();

router.get('/search', search.searchPermalinkSuggestions);

export default router;
