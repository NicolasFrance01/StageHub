'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboardPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events?status=PENDING');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching pending events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.patch(`/events/${id}/status`, { status });
            alert(`Evento ${status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}`);
            fetchEvents();
        } catch (error) {
            alert('Error al actualizar el estado del evento.');
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-indigo-600">Cargando eventos pendientes...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Panel de Administración - StageHub</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4 text-indigo-600">Eventos Pendientes de Aprobación</h2>
                    <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Evento / Organizador</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha / Lugar</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio / Capacidad</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {events.length > 0 ? events.map((event: any) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{event.title}</div>
                                            <div className="text-xs text-gray-500">{event.organizer.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500">{event.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">${event.price}</div>
                                            <div className="text-xs text-gray-500">{event.capacity} personas</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleStatusUpdate(event.id, 'APPROVED')}
                                                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition shadow-sm"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(event.id, 'REJECTED')}
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition shadow-sm"
                                            >
                                                Rechazar
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hay eventos pendientes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
