import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/shared/Spinner';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/v1/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.success) {
          setJobs(data.jobs.slice(0, 5));
        } else {
          toast.error('Failed to load jobs: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error.response?.data || error.message);
        toast.error('Failed to load jobs. Please try again.');
      }
    };
    fetchJobs();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Dashboard</h1>
      <h3>Recent Jobs</h3>
      {loading ? (
        <Spinner />
      ) : (
        <div className="row">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job._id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{job.position}</h5>
                    <p className="card-text">{job.company} - {job.workLocation}</p>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs available</p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;