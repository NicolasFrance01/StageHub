'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function DashboardPage() {
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'USER') {
                    const res = await api.get('/orders/my-orders');
                    setData(res.data);
                } else if (user.role === 'ORGANIZER') {
                    const res = await api.get('/events/my-events');
                    setData(res.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    if (loading) return <div className="p-12 text-center animate-pulse text-indigo-600">Cargando tu información...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {user.name}</h1>
                    <p className="text-gray-500">Tipo de cuenta: <span className="capitalize">{user.role.toLowerCase()}</span></p>
                </div>
                {user.role === 'ORGANIZER' && (
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                        Crear Nuevo Evento
                    </button>
                )}
            </header>

            {user.role === 'USER' ? (
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Mis Entradas</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data && data.length > 0 ? data.map((order: any) => (
                            <div key={order.id} className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg">{order.event.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'VALIDADO' ? 'bg-green-100 text-green-700' :
                                                order.status === 'RECHAZADO' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{new Date(order.event.date).toLocaleDateString()}</p>
                                    <p className="text-sm font-bold">{order.tickets.length} entradas</p>
                                </div>

                                {order.status === 'PENDIENTE' ? (
                                    <button className="mt-6 w-full py-3 bg-gray-50 text-indigo-600 font-bold rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition">
                                        Subir Comprobante
                                    </button>
                                ) : order.status === 'VALIDADO' ? (
                                    <button className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition">
                                        Ver QR / PDF
                                    </button>
                                ) : null}
                            </div>
                        )) : <p className="text-gray-500 py-12 text-center col-span-full">Aún no tienes entradas.</p>}
                    </div>
                </section>
            ) : user.role === 'ORGANIZER' ? (
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Mis Eventos</h2>
                    <div className="bg-white rounded-3xl border overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ventas</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data && data.length > 0 ? data.map((event: any) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{event.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${event.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button className="text-indigo-600 font-bold hover:text-indigo-900">Gestionar</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No has creado eventos aún.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}
        </div>
    );
}
