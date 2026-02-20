import { Router } from 'express';
import { verifyTicket } from '../controllers/ticket.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/verify', authenticateJWT, authorizeRoles('ORGANIZER', 'ADMIN'), verifyTicket);

export default router;
