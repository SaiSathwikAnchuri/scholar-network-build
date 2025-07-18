import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Share, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Events = () => {
  const { user } = useAuth();

  const mockEvents = [
    {
      id: 1,
      title: 'Annual Alumni Meet 2024',
      date: '2024-02-15',
      time: '6:00 PM',
      location: 'University Campus, Main Hall',
      description: 'Join us for our annual alumni gathering...',
      category: 'Networking',
      attendees: 234,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
      isVirtual: false
    },
    {
      id: 2,
      title: 'Tech Talk: AI in Industry',
      date: '2024-02-20',
      time: '7:00 PM',
      location: 'Virtual Event',
      description: 'Learn about the latest AI trends and applications...',
      category: 'Educational',
      attendees: 156,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
      isVirtual: true
    },
    {
      id: 3,
      title: 'Career Fair 2024',
      date: '2024-02-25',
      time: '10:00 AM',
      location: 'University Campus, Sports Complex',
      description: 'Connect with top employers and explore career opportunities...',
      category: 'Career',
      attendees: 412,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
      isVirtual: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Networking':
        return 'bg-blue-100 text-blue-800';
      case 'Educational':
        return 'bg-orange-100 text-orange-800';
      case 'Career':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-2">Connect and learn through alumni events</p>
        </div>
        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <Badge 
                className={`absolute top-3 right-3 ${getCategoryColor(event.category)}`}
              >
                {event.category}
              </Badge>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{event.time}</span>
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
                  <span>{event.attendees} attending</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm">RSVP</Button>
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