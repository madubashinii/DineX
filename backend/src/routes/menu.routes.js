import express from 'express';
import { getMenuItems, createMenuItem } from '../controllers/menu.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { admin } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getMenuItems);
router.post('/', protect, admin, createMenuItem);

export default router;