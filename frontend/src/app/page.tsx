'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Descubre los mejores eventos
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          StageHub te conecta con las mejores experiencias.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {events.length > 0 ? events.map((event: any) => (
            <div key={event.id} className="group relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-75 transition-opacity">
                {/* Placeholder for event image */}
                <div className="flex items-center justify-center h-48 bg-indigo-100 text-indigo-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      <Link href={`/events/${event.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {event.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                  </div>
                  <p className="text-lg font-bold text-indigo-600">${event.price}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Disponible
                  </span>
                  <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No hay eventos publicados en este momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
