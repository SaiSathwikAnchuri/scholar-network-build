import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  UserPlus,
  Bell,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app this would come from API
  const stats = {
    totalAlumni: 1250,
    activeJobs: 23,
    upcomingEvents: 5,
    unreadMessages: 7,
    newConnections: 12,
    profileViews: 45,
  };

  const recentJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Google',
      postedBy: 'Sarah Johnson',
      postedAt: '2 hours ago',
      type: 'Full-time',
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'Microsoft',
      postedBy: 'David Chen',
      postedAt: '5 hours ago',
      type: 'Full-time',
    },
    {
      id: '3',
      title: 'Data Scientist Intern',
      company: 'Netflix',
      postedBy: 'Emily Davis',
      postedAt: '1 day ago',
      type: 'Internship',
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Alumni Networking Night',
      date: '2024-01-15',
      location: 'Campus Center',
      attendees: 42,
    },
    {
      id: '2',
      title: 'Tech Talk: AI in Healthcare',
      date: '2024-01-18',
      location: 'Virtual',
      attendees: 156,
    },
    {
      id: '3',
      title: 'Career Fair 2024',
      date: '2024-01-25',
      location: 'Main Auditorium',
      attendees: 89,
    },
  ];

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
              3 posted today
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
              Next: Tomorrow
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
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-start justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      by {job.postedBy} • {job.postedAt}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
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
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start justify-between p-3 rounded-lg border">
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
                <Button size="sm" variant="outline">
                  RSVP
                </Button>
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
              <>
                <Link to="/admin">
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Approve Users
                </Button>
              </>
            )}
            
            {(user?.role === 'alumni' || user?.role === 'admin') && (
              <>
                <Link to="/jobs">
                  <Button variant="outline">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post a Job
                  </Button>
                </Link>
                <Link to="/events">
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

export default Dashboard;