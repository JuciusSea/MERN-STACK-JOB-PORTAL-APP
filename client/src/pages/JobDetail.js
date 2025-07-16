import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      const { data } = await axios.post(`/api/v1/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (data.success) {
        toast.success('Application submitted successfully');
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to apply. Please login.');
      navigate('/login');
    }
  };

  if (loading || !job) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <h1 className="text-center">{job.position}</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{job.company}</h5>
          <p className="card-text">Location: {job.location}</p>
          <p className="card-text">Description: {job.description}</p>
          <button onClick={handleApply} className="btn btn-primary">Apply Now</button>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;