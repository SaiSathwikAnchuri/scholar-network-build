import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  MapPin, Briefcase, Calendar, MessageSquare, Linkedin,
  Github, Globe, Mail, Phone, GraduationCap, Award, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [myRsvpEvents, setMyRsvpEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let res;
        if (id && id !== "undefined") {
          res = await axios.get(`${API}/api/users/profile/${id}`);
        } else {
          res = await axios.get(`${API}/api/users/me`);
        }
        setProfileUser(res.data);
      } catch (e) {
        setProfileUser(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  // Fetch rsvpd events if this is the student's own profile
  useEffect(() => {
    if (
      profileUser &&
      (profileUser.role === "student") &&
      ((currentUser?._id || currentUser?.id) === (profileUser._id || profileUser.id))
    ) {
      axios.get(`${API}/api/events/my/rsvp`).then(res => setMyRsvpEvents(res.data));
    }
  }, [profileUser, currentUser]);

  if (loading)
    return (
      <div className="flex flex-col items-center pt-24">
        <h2 className="text-lg text-muted-foreground">Loading profile...</h2>
      </div>
    );
  if (!profileUser)
    return (
      <div className="flex flex-col items-center pt-24">
        <h2 className="text-lg text-muted-foreground">Profile not found.</h2>
      </div>
    );

  const currentUserId = currentUser?._id || currentUser?.id;
  const profileUserId = profileUser?._id || profileUser?.id;
  const isOwnProfile = currentUserId === profileUserId;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profileUser.profilePicture || profileUser.profilePhoto} alt={profileUser.name} />
                  <AvatarFallback className="text-2xl">
                    {profileUser.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-background ${
                    profileUser.isOnline ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                />
              </div>
              <div className="mt-4 flex gap-2">
                {!isOwnProfile && (
                  <>
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  </>
                )}
                {isOwnProfile && (
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                <p className="text-xl text-muted-foreground">{profileUser.currentPosition}</p>
                <p className="text-lg font-medium text-primary">{profileUser.company}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                {profileUser.graduationYear && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Class of {profileUser.graduationYear} • {profileUser.department}
                  </div>
                )}
                {profileUser.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profileUser.location}
                  </div>
                )}
                {profileUser.cgpa && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    CGPA: {profileUser.cgpa}
                  </div>
                )}
                {profileUser.experience && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {profileUser.experience.length} work experiences
                  </div>
                )}
              </div>
              {profileUser.skills && (
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills.slice(0, 8).map((skill: any, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                  {profileUser.skills.length > 8 && (
                    <Badge variant="outline">+{profileUser.skills.length - 8} more</Badge>
                  )}
                </div>
              )}
              <div className="flex gap-4">
                {profileUser.linkedin && (
                  <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </a>
                )}
                {profileUser.github && (
                  <a href={profileUser.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </a>
                )}
                {profileUser.website && (
                  <a href={profileUser.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STUDENT RSVP EVENTS */}
      {isOwnProfile && profileUser.role === "student" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Events You've RSVPd</h2>
          {myRsvpEvents.length === 0 && (
            <div className="text-muted-foreground">No events RSVPd yet.</div>
          )}
          {myRsvpEvents.map(ev => (
            <div key={ev._id} className="border rounded p-3 mb-2 flex justify-between items-center">
              <div>
                <div className="font-bold">{ev.title}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(ev.date).toLocaleDateString()} | {ev.location}
                </div>
              </div>
              <Badge variant="success">RSVPd</Badge>
            </div>
          ))}
        </div>
      )}
      
      {/* Profile Tabs */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {profileUser.bio}
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileUser.email}</span>
                </div>
                {profileUser.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileUser.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profileUser.location}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{profileUser.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Degree:</span>
                  <span>{profileUser.degree}</span>
                </div>
                {profileUser.graduationYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graduation Year:</span>
                    <span>{profileUser.graduationYear}</span>
                  </div>
                )}
                {profileUser.cgpa && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGPA:</span>
                    <span>{profileUser.cgpa}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="experience" className="space-y-6">
          {profileUser.experience && profileUser.experience.map((exp: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{exp.title}</CardTitle>
                    <CardDescription>{exp.company}</CardDescription>
                  </div>
                  <Badge variant="outline">{exp.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileUser.achievements && profileUser.achievements.map((achievement: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mentorship" className="space-y-6">
          {profileUser.mentorshipStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{profileUser.mentorshipStats.studentsHelped}</CardTitle>
                  <CardDescription>Students Helped</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{profileUser.mentorshipStats.jobPlacements}</CardTitle>
                  <CardDescription>Job Placements</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{profileUser.mentorshipStats.projects}</CardTitle>
                  <CardDescription>Projects Mentored</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Request Mentorship</CardTitle>
              <CardDescription>
                Get guidance from {profileUser.name} on career development and technical skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isOwnProfile && (
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Mentorship
                </Button>
              )}
              {isOwnProfile && (
                <p className="text-muted-foreground">
                  Other users can request mentorship from this section
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
