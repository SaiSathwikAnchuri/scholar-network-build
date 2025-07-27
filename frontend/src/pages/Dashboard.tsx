import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users, Briefcase, Calendar, MessageSquare, TrendingUp, Clock,
  UserPlus, Bell, ArrowRight, Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Job {
  _id: string;
  title: string;
  company: string;
  postedBy: { name: string } | string;
  createdAt?: string;
  type?: string;
}
interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  attendees?: number;
  createdAt: string;
  description?: string;
}
interface Stats {
  totalAlumni: number;
  activeJobs: number;
  upcomingEvents: number;
  unreadMessages: number;
  newConnections: number;
  profileViews: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats>({
    totalAlumni: 0,
    activeJobs: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
    newConnections: 0,
    profileViews: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentEvent, setRecentEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Alumni count
        const usersRes = await axios.get(`${API}/api/users/directory`);
        const alumniList = usersRes.data.filter((u: any) => u.role === 'alumni');
        setStats(prev => ({ ...prev, totalAlumni: alumniList.length }));

        // Jobs
        const jobsRes = await axios.get(`${API}/api/jobs`);
        setStats(prev => ({ ...prev, activeJobs: jobsRes.data.length }));
        setRecentJobs(jobsRes.data
          .sort((a: Job, b: Job) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 3)
          .map((j: any) => ({
            _id: j._id,
            title: j.title,
            company: j.company,
            postedBy: typeof j.postedBy === 'object' ? j.postedBy.name : j.postedBy,
            createdAt: j.createdAt,
            type: j.type || "Full-time",
          })));

        // Events
        const eventsRes = await axios.get(`${API}/api/events`);
        setStats(prev => ({ ...prev, upcomingEvents: eventsRes.data.length }));

        // Find most recent event (by posted time)
        const allEvents = eventsRes.data;
        allEvents.sort((a: Event, b: Event) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentEvent(allEvents[0] || null);

        // Upcoming events: by soonest event date
        const soonestEvents = [...allEvents].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setUpcomingEvents(soonestEvents.slice(0, 3).map((e: any) => ({
          _id: e._id,
          title: e.title,
          date: e.date,
          location: e.location,
          attendees: e.attendees ? e.attendees.length : 0,
          createdAt: e.createdAt,
        })));

        // Messages (thread count)
        const messagesRes = await axios.get(`${API}/api/messages`);
        setStats(prev => ({ ...prev, unreadMessages: messagesRes.data.length }));

        // Mocked values
        setStats(prev => ({
          ...prev,
          newConnections: 12,
          profileViews: 45,
        }));
      } catch (e) {
        // Optionally: show error toast
      }
    };
    fetchStats();
  }, []);

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return `Welcome back, ${user.name}! You have administrative privileges.`;
      case 'alumni':
        return `Welcome back, ${user.name}! Class of ${user.graduationYear}`;
      case 'student':
        return `Welcome back, ${user.name}! Keep building your network.`;
      default:
        return `Welcome back, ${user?.name}!`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="gradient-bg p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin' && 'Manage users, events, and platform settings.'}
          {user?.role === 'alumni' && 'Connect with fellow alumni and help current students.'}
          {user?.role === 'student' && 'Explore opportunities and connect with alumni.'}
        </p>
      </div>

      {/* Most Recently Posted Event */}
      {recentEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Posted Event</CardTitle>
            <CardDescription>Don’t miss this opportunity!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <div className="font-bold text-primary">{recentEvent.title}</div>
                <div className="text-sm text-muted-foreground mb-2">{recentEvent.location}</div>
                <div className="text-xs text-muted-foreground">
                  Posted {formatAgo(recentEvent.createdAt)}
                  {recentEvent.date && (
                    <> &mdash; Event date: {new Date(recentEvent.date).toLocaleDateString()}</>
                  )}
                </div>
                {recentEvent.description && (
                  <p className="mt-2">{recentEvent.description}</p>
                )}
              </div>
              <Link to={`/events/${recentEvent._id}`}>
                <Button>View Event</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlumni}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              {/* Optionally, you could compute jobs posted today */}
              {recentJobs.filter(j => {
                if (!j.createdAt) return false;
                const d = new Date(j.createdAt);
                const now = new Date();
                return d.toDateString() === now.toDateString();
              }).length} posted today
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              <Bell className="inline h-3 w-3 mr-1" />
              {upcomingEvents.length > 0 ?
                `Next: ${new Date(upcomingEvents[0].date).toLocaleDateString()}`
                : 'No upcoming'}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              <UserPlus className="inline h-3 w-3 mr-1" />
              {stats.newConnections} new connections
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Latest opportunities from alumni</CardDescription>
              </div>
              <Link to="/jobs">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.length === 0 && <div className="text-muted-foreground">No jobs found.</div>}
            {recentJobs.map((job) => (
              <div key={job._id} className="flex items-start justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      by {typeof job.postedBy === 'object'
                        ? (job.postedBy as any).name
                        : job.postedBy}
                      {job.createdAt && <> &bull; {formatAgo(job.createdAt)}</>}
                    </span>
                  </div>
                </div>
                <Link to={`/jobs/${job._id}`}>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss these upcoming activities</CardDescription>
              </div>
              <Link to="/events">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length === 0 && <div className="text-muted-foreground">No events found.</div>}
            {upcomingEvents.map((event) => (
              <div key={event._id} className="flex items-start justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {event.attendees} attending
                    </span>
                  </div>
                </div>
                <Link to={`/events/${event._id}`}>
                  <Button size="sm" variant="outline">
                    RSVP
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks based on your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            {(user?.role === 'alumni' || user?.role === 'admin') && (
              <>
                <Link to="/jobs/new">
                  <Button variant="outline">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post a Job
                  </Button>
                </Link>
                <Link to="/events/new">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
              </>
            )}
            <Link to="/directory">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Browse Alumni
              </Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper: shows "2 hours ago", etc.
function formatAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = +now - +date;
  const diffMin = Math.floor(diffMs / 1000 / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString();
}

export default Dashboard;
