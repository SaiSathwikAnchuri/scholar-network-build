export type UserRole = 'admin' | 'alumni' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  // Alumni/Student specific fields
  graduationYear?: number;
  currentPosition?: string;
  company?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  website?: string;
  phone?: string;
  // Academic info
  department?: string;
  degree?: string;
  cgpa?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary?: string;
  postedBy: User;
  postedAt: Date;
  deadline: Date;
  applications: number;
  isActive: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'Workshop' | 'Seminar' | 'Networking' | 'Social' | 'Career Fair';
  organizer: User;
  maxAttendees?: number;
  currentAttendees: number;
  rsvpList: string[]; // user IDs
  imageUrl?: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalAlumni: number;
  totalStudents: number;
  totalEvents: number;
  totalJobs: number;
  activeJobs: number;
  upcomingEvents: number;
  newApplications: number;
  newMessages: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'job_posted' | 'event_created' | 'user_registered' | 'job_applied' | 'event_rsvp';
  user: User;
  description: string;
  timestamp: Date;
  relatedId?: string; // job ID, event ID, etc.
}

export type Theme = 'light' | 'dark' | 'cyberpunk' | 'business' | 'emerald' | 'synthwave' | 'forest';

export interface UserPreferences {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    jobAlerts: boolean;
    eventReminders: boolean;
    messages: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowDirectMessages: boolean;
  };
}