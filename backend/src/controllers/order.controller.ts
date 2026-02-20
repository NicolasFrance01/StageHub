import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { v4 as uuidv4 } from 'uuid'; // I need to install uuid

export const createOrder = async (req: any, res: Response) => {
    try {
        const { eventId, quantity } = req.body;
        const userId = req.user.userId;

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const total = event.price * quantity;

        const order = await prisma.order.create({
            data: {
                userId,
                eventId,
                total,
                status: 'PENDIENTE',
            },
        });

        // Generate Tickets
        const tickets = [];
        for (let i = 0; i < quantity; i++) {
            const ticketUid = uuidv4();
            // Placeholder for QR code URL - will be generated in verification step or after payment
            const qrCodeUrl = `stagehub-ticket-${ticketUid}`;

            const ticket = await prisma.ticket.create({
                data: {
                    orderId: order.id,
                    ticketUid,
                    qrCodeUrl,
                    status: 'ACTIVO'
                }
            });
            tickets.push(ticket);
        }

        res.status(201).json({ order, tickets });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export const getMyOrders = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { event: true, tickets: true },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

export const validateOrderPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // VALIDADO, RECHAZADO

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: { event: true }
        });

        if (status === 'VALIDADO') {
            // Calculate commission
            const commissionPercentage = 10; // 10% by default
            const adminAmount = order.total * (commissionPercentage / 100);
            const organizerAmount = order.total - adminAmount;

            await prisma.commission.create({
                data: {
                    orderId: order.id,
                    percentage: commissionPercentage,
                    adminAmount,
                    organizerAmount
                }
            });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error validating order', error });
    }
};
