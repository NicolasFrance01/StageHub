'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function EventDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEvent();
    }, [id]);

    const handleBuy = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setBuying(true);
        try {
            const response = await api.post('/orders', { eventId: id, quantity });
            alert('Orden creada con éxito. Por favor sube tu comprobante de pago.');
            router.push('/dashboard');
        } catch (error) {
            alert('Error al crear la orden.');
        } finally {
            setBuying(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20 animate-pulse text-indigo-600">Cargando evento...</div>;
    if (!event) return <div className="text-center py-20 text-red-500">Evento no encontrado.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-64 bg-indigo-600 flex items-center justify-center relative">
                    <h1 className="text-4xl font-extrabold text-white text-center px-4">{event.title}</h1>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Descripción</h2>
                            <p className="mt-4 text-gray-600 leading-relaxed text-lg">{event.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <span className="block text-sm text-gray-400">Fecha</span>
                                <span className="font-bold text-gray-900">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <span className="block text-sm text-gray-400">Lugar</span>
                                <span className="font-bold text-gray-900">{event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600">Precio</span>
                                <span className="text-3xl font-extrabold text-indigo-600">${event.price}</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} entrada{n > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-indigo-200">
                                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                                        <span>Total</span>
                                        <span>${event.price * quantity}</span>
                                    </div>
                                    <button
                                        onClick={handleBuy}
                                        disabled={buying}
                                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
                                    >
                                        {buying ? 'Procesando...' : 'Comprar Ahora'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-400">
                            Al comprar, aceptas nuestros términos y condiciones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
