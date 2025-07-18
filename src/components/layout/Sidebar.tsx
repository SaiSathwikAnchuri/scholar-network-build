import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  GraduationCap,
  Home,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Settings,
  Shield,
  User,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'alumni', 'student'] },
    { name: 'Alumni Directory', href: '/directory', icon: Users, roles: ['admin', 'alumni', 'student'] },
    { name: 'Job Board', href: '/jobs', icon: Briefcase, roles: ['admin', 'alumni', 'student'] },
    { name: 'Events', href: '/events', icon: Calendar, roles: ['admin', 'alumni', 'student'] },
    { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['admin', 'alumni', 'student'] },
    { name: 'My Profile', href: `/profile/${user?.id}`, icon: User, roles: ['admin', 'alumni', 'student'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'alumni', 'student'] },
    { name: 'Admin Panel', href: '/admin', icon: Shield, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Alumni Portal</h1>
            <p className="text-xs text-muted-foreground">College Network</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href.includes('/profile/') && location.pathname.includes('/profile/'));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <div className={cn(
            'w-2 h-2 rounded-full',
            user?.isOnline ? 'bg-success' : 'bg-muted-foreground'
          )} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;