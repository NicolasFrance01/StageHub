import prisma from '../config/prisma.js';
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, price, capacity } = req.body;
        const organizerId = req.user.userId;
        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                price: parseFloat(price),
                capacity: parseInt(capacity),
                organizerId,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};
export const getEvents = async (req, res) => {
    try {
        const { status } = req.query;
        const events = await prisma.event.findMany({
            where: status ? { status: status } : { status: 'APPROVED' },
            include: { organizer: { select: { name: true } } },
        });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await prisma.event.findUnique({
            where: { id },
            include: { organizer: { select: { name: true } } },
        });
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching event', error });
    }
};
export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED, REJECTED, SUSPENDED
        const event = await prisma.event.update({
            where: { id },
            data: { status },
        });
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating event status', error });
    }
};
export const getOrganizerEvents = async (req, res) => {
    try {
        const organizerId = req.user.userId;
        const events = await prisma.event.findMany({
            where: { organizerId },
        });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching organizer events', error });
    }
};
//# sourceMappingURL=event.controller.js.map