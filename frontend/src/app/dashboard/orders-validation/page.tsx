'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function OrdersValidationPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingOrders = async () => {
        try {
            // Simplified for prototype: fetching all pending orders. 
            // In real app, search by eventId or organizerId.
            const response = await api.get('/orders/my-orders'); // Placeholder for a real "all pending" endpoint
            setOrders(response.data.filter((o: any) => o.status === 'PENDIENTE'));
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const handleValidation = async (id: string, status: string) => {
        try {
            await api.patch(`/orders/${id}/validate`, { status });
            alert(`Orden ${status === 'VALIDADO' ? 'Validada' : 'Rechazada'}`);
            fetchPendingOrders();
        } catch (error) {
            alert('Error al validar la orden.');
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-indigo-600">Cargando órdenes pendientes...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Validación de Pagos Manuales</h1>

            <div className="grid gap-6">
                {orders.length > 0 ? orders.map((order: any) => (
                    <div key={order.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-indigo-600">{order.event.title}</h3>
                            <div className="mt-2 text-sm space-y-1">
                                <p><span className="text-gray-500 font-medium">Usuario:</span> {order.user.name}</p>
                                <p><span className="text-gray-500 font-medium">Total:</span> ${order.total}</p>
                                <p><span className="text-gray-500 font-medium">Cantidad:</span> {order.tickets.length} entradas</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleValidation(order.id, 'VALIDADO')}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition"
                            >
                                Confirmar Pago
                            </button>
                            <button
                                onClick={() => handleValidation(order.id, 'RECHAZADO')}
                                className="bg-red-50 text-red-600 border border-red-200 px-8 py-3 rounded-2xl font-bold hover:bg-red-100 transition"
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-500">
                        No hay pagos pendientes de validación.
                    </div>
                )}
            </div>
        </div>
    );
}
