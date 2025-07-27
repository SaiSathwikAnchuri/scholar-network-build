import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type AlumniType = {
  _id: string;
  name: string;
  profilePicture?: string;
  profilePhoto?: string;
  graduationYear?: number; // made optional!
  currentPosition?: string;
  company?: string;
  location?: string;
  department?: string;
  skills?: string[];
  isOnline?: boolean;
};

const Directory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all-years');
  const [filterDepartment, setFilterDepartment] = useState('all-departments');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [alumni, setAlumni] = useState<AlumniType[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch alumni directory from backend
  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        let url = `${API}/api/users/directory?`;
        let params: any = {};
        if (searchQuery) params.search = searchQuery;
        if (filterYear !== 'all-years') params.year = filterYear;
        if (filterDepartment !== 'all-departments') params.department = filterDepartment;
        const query = new URLSearchParams(params).toString();
        if (query) url += query;

        const res = await axios.get(url);
        setAlumni(res.data || []);
      } catch (e) {
        setAlumni([]);
      }
      setLoading(false);
    };
    fetchAlumni();
    // eslint-disable-next-line
  }, [searchQuery, filterYear, filterDepartment]);

  // For dropdowns
  const allDepartments = Array.from(new Set(alumni.map((person) => person.department).filter(Boolean)));
  const allYears = Array.from(
    new Set(alumni.map((person) => person.graduationYear).filter((year) => year !== undefined && year !== null))
  ).sort((a, b) => (b as number) - (a as number));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alumni Directory</h1>
        <p className="text-muted-foreground">
          Connect with {alumni.length} alumni from your college
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Graduation Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-years">All Years</SelectItem>
                  {allYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">All Departments</SelectItem>
                  {allDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterYear('all-years');
                  setFilterDepartment('all-departments');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {alumni.length} alumni
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {loading && (
        <div className="p-6 text-center text-muted-foreground">Loading alumni...</div>
      )}

      {/* Alumni Grid/List */}
      {!loading && (
        <>
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {alumni.map((person) => (
              <Card key={person._id} className="card-hover">
                <CardContent className="p-6">
                  <div className={viewMode === 'list' ? 'flex items-start space-x-4' : 'text-center'}>
                    <div className={`relative ${viewMode === 'list' ? '' : 'mb-4'}`}>
                      <Avatar className={viewMode === 'list' ? 'h-16 w-16' : 'h-20 w-20 mx-auto'}>
                        <AvatarImage src={person.profilePicture || person.profilePhoto} alt={person.name} />
                        <AvatarFallback>
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                        person.isOnline ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <div className={`flex-1 ${viewMode === 'list' ? 'space-y-1' : 'space-y-2'}`}>
                      <div>
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <p className="text-muted-foreground">{person.currentPosition}</p>
                        <p className="text-sm font-medium text-primary">{person.company}</p>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                        {person.graduationYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Class of {person.graduationYear}
                          </div>
                        )}
                        {person.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {person.location}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {person.skills?.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {person.skills && person.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{person.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Link to={`/profile/${person._id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Briefcase className="mr-2 h-3 w-3" />
                            View Profile
                          </Button>
                        </Link>
                        <Button size="sm" variant="secondary" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-3" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {alumni.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No alumni found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or clearing the filters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Directory;