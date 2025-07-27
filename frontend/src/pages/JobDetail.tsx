import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  useEffect(() => {
    if (id) axios.get(`${API}/api/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);
  if (!job) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="text-muted-foreground">{job.company}</div>
      <div className="mt-2">{job.type}</div>
      <div className="mt-4">{job.description}</div>
    </div>
  );
};
export default JobDetail;
