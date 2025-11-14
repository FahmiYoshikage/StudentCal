import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';

// ============================================
// EventsPage Component
// ============================================
const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('upcoming'); // upcoming, past, all
    const { success, error: showError } = useNotification();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            // This would call eventsService.getAllEvents()
            // For now, mock data
            const mockEvents = [];
            setEvents(mockEvents);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter((event) => {
        const now = new Date();
        const eventDate = new Date(event.startDateTime);

        if (filter === 'upcoming') return eventDate >= now;
        if (filter === 'past') return eventDate < now;
        return true;
    });

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen p-6 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            📅 Custom Events
                        </h1>
                        <p className="text-white/60">
                            Manage your personal events and activities
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center gap-2">
                        ➕ Add Event
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-6">
                    {['upcoming', 'past', 'all'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                filter === tab
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events List */}
            <div className="max-w-7xl mx-auto">
                {filteredEvents.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="text-6xl mb-4">📆</div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            No {filter} events
                        </h3>
                        <p className="text-white/60 mb-6">
                            Add custom events to track your activities
                        </p>
                        <button className="btn-primary">
                            ➕ Add Your First Event
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map((event, index) => (
                            <div
                                key={event._id}
                                className="glass-card p-6 hover:scale-102 transition-all animate-slide-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Event content would go here */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
