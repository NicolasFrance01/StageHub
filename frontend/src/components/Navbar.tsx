'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        StageHub
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                            Eventos
                        </Link>

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                    {user.role === 'ADMIN' ? 'Admin Panel' : user.role === 'ORGANIZER' ? 'Panel Organizador' : 'Mis Entradas'}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-sm font-medium transition"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition shadow-lg shadow-indigo-200">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
