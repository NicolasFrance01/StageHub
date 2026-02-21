import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const verifyTicket = async (req: any, res: Response) => {
    try {
        const { ticketUid } = req.body;
        const organizerId = req.user.userId;

        const ticket = await prisma.ticket.findUnique({
            where: { ticketUid },
            include: {
                order: { include: { event: true } },
                scans: true
            }
        });

        if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });

        // Check if event belongs to organizer
        if (ticket.order.event.organizerId !== organizerId) {
            return res.status(403).json({ message: 'No tienes permiso para validar este ticket' });
        }

        if (ticket.status === 'USADO') {
            return res.status(400).json({
                message: 'Ticket ya utilizado',
                scannedAt: ticket.scans[0]?.scannedAt // Simplified
            });
        }

        if (ticket.status !== 'ACTIVO') {
            return res.status(400).json({ message: 'Ticket no válido o cancelado' });
        }

        // Mark as used and record scan
        await prisma.ticket.update({
            where: { id: ticket.id },
            data: { status: 'USADO' }
        });

        await prisma.ticketScan.create({
            data: {
                ticketId: ticket.id,
                validatedBy: organizerId
            }
        });

        res.json({
            message: '¡Ticket Válido!',
            event: ticket.order.event.title,
            orderId: ticket.orderId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error verificando ticket', error });
    }
};
