import { Router } from 'express';
import { verifyTicket } from '../controllers/ticket.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.post('/verify', authenticateJWT, authorizeRoles('ORGANIZER', 'ADMIN'), verifyTicket);

export default router;
