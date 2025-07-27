import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const EventsNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: "",
    isVirtual: false,
  });
  const [loading, setLoading] = useState(false);

  if (!user || (user.role !== "alumni" && user.role !== "admin")) {
    return <div className="p-8 text-center text-lg">Not authorized to create events</div>;
  }

  const handleChange = (k: string, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/api/events`, form);
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input placeholder="Title" value={form.title} onChange={e => handleChange("title", e.target.value)} required />
            <Input type="date" placeholder="Date" value={form.date} onChange={e => handleChange("date", e.target.value)} required />
            <Input type="time" placeholder="Time" value={form.time} onChange={e => handleChange("time", e.target.value)} />
            <Input placeholder="Location" value={form.location} onChange={e => handleChange("location", e.target.value)} required />
            <Input placeholder="Category" value={form.category} onChange={e => handleChange("category", e.target.value)} />
            <Input placeholder="Image URL (optional)" value={form.image} onChange={e => handleChange("image", e.target.value)} />
            <textarea placeholder="Description" className="w-full p-2 border rounded" value={form.description} onChange={e => handleChange("description", e.target.value)} required />
            <label>
              <input type="checkbox" checked={form.isVirtual} onChange={e => handleChange("isVirtual", e.target.checked)} />
              Virtual Event
            </label>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsNew;
