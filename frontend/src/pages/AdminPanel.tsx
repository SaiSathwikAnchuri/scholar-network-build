import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  approved?: boolean;
}

interface EventType {
  _id: string;
  title: string;
  date: string;
  location: string;
  approved?: boolean;
}

interface JobType {
  _id: string;
  title: string;
  company: string;
  approved?: boolean;
}

const AdminPanel = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({ users: 0, events: 0, jobs: 0, messages: 0 });
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
  const [pendingEvents, setPendingEvents] = useState<EventType[]>([]);
  const [pendingJobs, setPendingJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch panel data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Users
        const usersRes = await axios.get(`${API}/api/users`);
        setStats((s) => ({ ...s, users: usersRes.data.length }));
        setPendingUsers(usersRes.data.filter((u: UserType) => u.role !== 'admin' && u.approved === false));

        // Events (assuming 'approved' property)
        const eventsRes = await axios.get(`${API}/api/events`);
        setStats((s) => ({ ...s, events: eventsRes.data.length }));
        setPendingEvents(eventsRes.data.filter((e: EventType) => e.approved === false || e.approved === undefined));

        // Jobs (assuming 'approved' property)
        const jobsRes = await axios.get(`${API}/api/jobs`);
        setStats((s) => ({ ...s, jobs: jobsRes.data.length }));
        setPendingJobs(jobsRes.data.filter((j: JobType) => j.approved === false || j.approved === undefined));

        // Messages count (threads)
        const messagesRes = await axios.get(`${API}/api/messages`);
        setStats((s) => ({ ...s, messages: messagesRes.data.length }));
      } catch (err) {
        // You can display error toast here
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Approvals & Rejections
  const handleUserApprove = async (id: string) => {
    await axios.patch(`${API}/api/users/${id}/approve`);
    setPendingUsers(prev => prev.filter(u => u._id !== id));
  };
  const handleUserReject = async (id: string) => {
    await axios.delete(`${API}/api/users/${id}`);
    setPendingUsers(prev => prev.filter(u => u._id !== id));
  };

  const handleEventApprove = async (id: string) => {
    await axios.patch(`${API}/api/events/${id}/approve`);
    setPendingEvents(prev => prev.filter(e => e._id !== id));
  };
  const handleEventReject = async (id: string) => {
    await axios.delete(`${API}/api/events/${id}`);
    setPendingEvents(prev => prev.filter(e => e._id !== id));
  };

  const handleJobApprove = async (id: string) => {
    await axios.patch(`${API}/api/jobs/${id}/approve`);
    setPendingJobs(prev => prev.filter(j => j._id !== id));
  };
  const handleJobReject = async (id: string) => {
    await axios.delete(`${API}/api/jobs/${id}`);
    setPendingJobs(prev => prev.filter(j => j._id !== id));
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card p-4 rounded shadow text-center">
          <div className="text-3xl font-bold">{stats.users}</div>
          <div className="text-muted-foreground">Users</div>
        </div>
        <div className="bg-card p-4 rounded shadow text-center">
          <div className="text-3xl font-bold">{stats.events}</div>
          <div className="text-muted-foreground">Events</div>
        </div>
        <div className="bg-card p-4 rounded shadow text-center">
          <div className="text-3xl font-bold">{stats.jobs}</div>
          <div className="text-muted-foreground">Jobs</div>
        </div>
        <div className="bg-card p-4 rounded shadow text-center">
          <div className="text-3xl font-bold">{stats.messages}</div>
          <div className="text-muted-foreground">Message Threads</div>
        </div>
      </div>

      {/* Pending User Approvals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending User Approvals</h2>
        {pendingUsers.length === 0 && <div className="text-muted-foreground">No users pending approval.</div>}
        <div className="space-y-2">
          {pendingUsers.map(u => (
            <div key={u._id} className="flex items-center justify-between bg-muted rounded p-3">
              <span>{u.name} ({u.email}) — <span className="capitalize">{u.role}</span></span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleUserApprove(u._id)}>Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => handleUserReject(u._id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Event Approvals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Event Approvals</h2>
        {pendingEvents.length === 0 && <div className="text-muted-foreground">No events pending approval.</div>}
        <div className="space-y-2">
          {pendingEvents.map(e => (
            <div key={e._id} className="flex items-center justify-between bg-muted rounded p-3">
              <span>{e.title} – {e.date?.slice(0,10)} {e.location && `@${e.location}`}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEventApprove(e._id)}>Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => handleEventReject(e._id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Job Approvals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Job Approvals</h2>
        {pendingJobs.length === 0 && <div className="text-muted-foreground">No jobs pending approval.</div>}
        <div className="space-y-2">
          {pendingJobs.map(j => (
            <div key={j._id} className="flex items-center justify-between bg-muted rounded p-3">
              <span>{j.title} – {j.company}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleJobApprove(j._id)}>Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => handleJobReject(j._id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
