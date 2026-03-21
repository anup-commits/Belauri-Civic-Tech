import { useEffect, useState } from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'] & {
  profiles?: { full_name: string };
};

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    const now = new Date().toISOString();

    let query = supabase
      .from('events')
      .select('*, profiles(full_name)')
      .eq('is_published', true);

    if (filter === 'upcoming') {
      query = query.gte('event_date', now).order('event_date', { ascending: true });
    } else {
      query = query.lt('event_date', now).order('event_date', { ascending: false });
    }

    const { data, error } = await query;

    if (!error && data) {
      setEvents(data as Event[]);
    }
    setLoading(false);
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <section id="events" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Events & Campaigns
          </h2>
          <p className="text-xl text-gray-600">
            Join us in our fight for transparency and accountability
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'past'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-600 mt-4">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">
              {filter === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = formatEventDate(event.event_date);
              return (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {event.image_url && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-red-600 text-white rounded-lg p-3 text-center min-w-[60px]">
                        <div className="text-2xl font-bold">{eventDate.day}</div>
                        <div className="text-xs uppercase">{eventDate.month}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {eventDate.time}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Organized by {event.profiles?.full_name || 'Admin'}</span>
                      </div>
                    </div>

                    {filter === 'upcoming' && (
                      <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Join Event
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
