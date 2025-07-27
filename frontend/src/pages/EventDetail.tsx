import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (id) axios.get(`${API}/api/events/${id}`).then(res => setEvent(res.data));
  }, [id]);

  if (!event) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <div className="text-muted-foreground">{event.location}</div>
      <div className="mt-2">{new Date(event.date).toLocaleDateString()}</div>
      <div className="mt-4">{event.description}</div>
    </div>
  );
};

export default EventDetail;
