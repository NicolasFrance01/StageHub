import { Router } from 'express';
import { createOrder, getMyOrders, validateOrderPayment } from '../controllers/order.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, createOrder);
router.get('/my-orders', authenticateJWT, getMyOrders);
router.patch('/:id/validate', authenticateJWT, authorizeRoles('ADMIN', 'ORGANIZER'), validateOrderPayment);

export default router;
