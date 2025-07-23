import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment'; // Import moment to fix no-undef error
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Define state for description toggle
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.success) {
          setJob(data.job);
        } else {
          toast.error('Failed to load job: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching job:', error.response?.data || error.message);
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
      console.error('Apply error:', error.response?.data || error.message);
      toast.error('Failed to apply. Please login.');
      navigate('/login');
    }
  };

  const toggleDescription = (jobId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  if (loading || !job) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <h1 className="text-center text-3xl font-bold mb-6">{job.position}</h1>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg">
        <div className="p-6">
          <h5 className="text-xl font-semibold mb-2">{job.company}</h5>
          <p className="text-gray-700 mb-2"><strong>Company:</strong> {job.company}</p>
          <p className="text-gray-700 mb-2"><strong>Location:</strong> {job.workLocation}</p>
          <p className="text-gray-700 mb-2"><strong>Work Type:</strong> {job.workType}</p>
          <p className="text-gray-700 mb-2"><strong>Status:</strong> {job.status}</p>
          <p className="text-gray-700 mb-2">
            <strong>Posted:</strong> {moment(job.createdAt).format('MMM D, YYYY')}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Applicants:</strong> {job.applicants.length}
          </p>
          <p className="text-gray-700">
            <strong>Description:</strong>{' '}
            {expandedDescriptions[job._id]
              ? job.description
              : job.description.substring(0, 100) + (job.description.length > 100 ? '...' : '')}
            {job.description.length > 100 && (
              <button
                className="text-blue-500 hover:underline ml-2"
                onClick={() => toggleDescription(job._id)}
              >
                {expandedDescriptions[job._id] ? 'Show Less' : 'Show More'}
              </button>
            )}
          </p>
          <button
            onClick={handleApply}
            className="btn btn-primary"
          >
            Apply Now
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;