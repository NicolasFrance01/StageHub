'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function TicketScannerPage() {
    const [ticketUid, setTicketUid] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const response = await api.post('/tickets/verify', { ticketUid });
            setResult({ success: true, ...response.data });
            setTicketUid('');
        } catch (error: any) {
            setResult({
                success: false,
                message: error.response?.data?.message || 'Error al verificar el ticket'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Control de Acceso (Scan QR)</h1>

            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ingresar ID de Ticket (o usar Scanner)</label>
                        <input
                            type="text"
                            required
                            value={ticketUid}
                            onChange={(e) => setTicketUid(e.target.value)}
                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border text-center text-2xl font-mono tracking-widest"
                            placeholder="XXXXXXXX-XXXX-..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                            'Verificar Entrada'
                        )}
                    </button>
                </form>

                {result && (
                    <div className={`mt-8 p-6 rounded-2xl border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${result.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.success ? (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                )}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {result.success ? result.message : 'Error'}
                                </h3>
                                {result.success ? (
                                    <p className="text-green-700 mt-1">
                                        Evento: <span className="font-bold">{result.event}</span>
                                    </p>
                                ) : (
                                    <p className="text-red-700 mt-1">{result.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400 italic">
                    "En una versión real, aquí se integraría la cámara para escaneo directo de QR."
                </p>
            </div>
        </div>
    );
}
