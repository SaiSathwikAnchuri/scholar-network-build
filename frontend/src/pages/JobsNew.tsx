import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const JobsNew = () => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    deadline: '',
    description: '',
    skills: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/api/jobs`, {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      navigate('/jobs');
    } catch (error) {
      // Optionally handle error or show a toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Post a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Job Title" 
              value={form.title} 
              onChange={e => handleChange('title', e.target.value)}
              required
            />
            <Input 
              placeholder="Company" 
              value={form.company} 
              onChange={e => handleChange('company', e.target.value)}
              required
            />
            <Input 
              placeholder="Location" 
              value={form.location} 
              onChange={e => handleChange('location', e.target.value)}
              required
            />
            <Select value={form.type} onValueChange={val => handleChange('type', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Salary (optional)" 
              value={form.salary} 
              onChange={e => handleChange('salary', e.target.value)}
            />
            <Input 
              type="date" 
              placeholder="Deadline" 
              value={form.deadline} 
              onChange={e => handleChange('deadline', e.target.value)}
            />
            <Input 
              placeholder="Comma separated skills (e.g. React, Node.js)" 
              value={form.skills} 
              onChange={e => handleChange('skills', e.target.value)}
            />
            <textarea 
              className="w-full border rounded p-2" 
              rows={4} 
              placeholder="Job description" 
              value={form.description} 
              onChange={e => handleChange('description', e.target.value)} 
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsNew;
