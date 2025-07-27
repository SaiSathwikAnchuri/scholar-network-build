import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type EventType = {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  category: string;
  attendees: string[];
  image?: string;
  isVirtual?: boolean;
};

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/events`);
        setEvents(res.data || []);
      } catch {
        setEvents([]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId: string) => {
    try {
      await axios.post(`${API}/api/events/${eventId}/rsvp`);
      setEvents((list) =>
        list.map((evt) =>
          evt._id === eventId
            ? {
                ...evt,
                attendees: evt.attendees.includes(user?._id)
                  ? evt.attendees.filter((id) => id !== user?._id)
                  : [...(evt.attendees || []), user?._id],
              }
            : evt
        )
      );
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-2">Connect and learn through alumni events</p>
        </div>
        {(user?.role === "alumni" || user?.role === "admin") && (
          <Link to="/events/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && (
          <div className="col-span-full text-center text-muted-foreground py-12">Loading events...</div>
        )}
        {!loading && events.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No events found.
          </div>
        )}
        {events.map((event) => (
          <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={
                  event.image ||
                  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop'
                }
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-3 right-3">
                {event.category}
              </Badge>
            </div>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  {event.time && (
                    <>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{event.time}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{event.description}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {(event.attendees && event.attendees.length) || 0} attending
                  </span>
                </div>
                <div className="flex gap-2">
                  {user?.role === 'student' && (
                    event.attendees.includes(user._id) ? (
                      <Button size="sm" variant="secondary" disabled>
                        RSVPd
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleRSVP(event._id)}>
                        RSVP
                      </Button>
                    )
                  )}
                  <Link to={`/events/${event._id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;
