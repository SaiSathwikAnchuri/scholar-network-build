import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Calendar, Bookmark, Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type JobType = {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  createdAt?: string;
  deadline?: string;
  description: string;
  skills: string[];
  postedBy: { name: string } | string;
};

const Jobs = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all-types');
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/jobs`);
        setJobs(res.data || []);
      } catch {
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType =
      filterType === 'all-types' || job.type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Job Board</h1>
          <p className="text-muted-foreground mt-2">Discover opportunities from our alumni network</p>
        </div>
        {(user?.role === 'alumni' || user?.role === 'admin') && (
          <Link to="/jobs/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post Job
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {loading && (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              Loading jobs...
            </CardContent>
          </Card>
        )}
        {!loading &&
          filteredJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">{job.type}</Badge>
                    {job.salary && (
                      <div className="text-lg font-semibold text-primary">{job.salary}</div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Posted by {typeof job.postedBy === 'object'
                      ? (job.postedBy as any)?.name
                      : job.postedBy}{' '}
                    • Deadline: {job.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : 'N/A'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    {user && (
                      <Button size="sm" onClick={async () => {
                        // Call Apply endpoint in backend (handle errors/toasts as needed)
                        await axios.post(`${API}/api/jobs/${job._id}/apply`);
                      }}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
