import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    validateOrderPayment
} from '../controllers/order.controller.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// User routes
router.post('/', authenticateJWT, createOrder);
router.get('/my-orders', authenticateJWT, getMyOrders);

// Admin / Organizer routes (to validate manually)
router.patch('/:id/validate', authenticateJWT, authorizeRoles('ADMIN', 'ORGANIZER'), validateOrderPayment);

export default router;
