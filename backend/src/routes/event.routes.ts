import { Router } from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEventStatus,
    getOrganizerEvents
} from '../controllers/event.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Organizer routes
router.post('/', authenticateJWT, authorizeRoles('ORGANIZER', 'ADMIN'), createEvent);
router.get('/my-events', authenticateJWT, authorizeRoles('ORGANIZER'), getOrganizerEvents);

// Admin routes
router.patch('/:id/status', authenticateJWT, authorizeRoles('ADMIN'), updateEventStatus);

export default router;
