import PDFDocument from 'pdfkit';
import { generateQRCode } from './qr.service';

export const generateTicketPDF = async (ticket: any, event: any, user: any): Promise<Buffer> => {
    return new Promise(async (resolve, reject) => {
        const doc = new PDFDocument({ size: 'A6', margin: 20 });
        const chunks: any[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Header
        doc.fontSize(18).text('StageHub - Ticket', { align: 'center' });
        doc.moveDown();

        // Event Info
        doc.fontSize(12).text(`Evento: ${event.title}`);
        doc.text(`Fecha: ${new Date(event.date).toLocaleDateString()}`);
        doc.text(`Lugar: ${event.location}`);
        doc.moveDown();

        // Comprador Info
        doc.fontSize(10).text(`Comprador: ${user.name}`);
        doc.text(`DNI: ${user.dni || 'No proporcionado'}`);
        doc.moveDown();

        // QR Code
        const qrData = await generateQRCode(ticket.ticketUid);
        doc.image(qrData, { fit: [100, 100], align: 'center' });

        doc.moveDown();
        doc.fontSize(8).text(`ID Ticket: ${ticket.ticketUid}`, { align: 'center' });

        doc.end();
    });
};
