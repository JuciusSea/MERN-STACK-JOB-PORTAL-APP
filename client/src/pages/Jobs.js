import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import InputFrom from '../components/shared/InputFrom';
import Spinner from '../components/shared/Spinner';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const { loading } = useSelector((state) => state.alerts);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/v1/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (data.success) {
          setJobs(data.jobs);
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

  const filteredJobs = jobs.filter(job =>
    job.position.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-center">Latest Jobs</h1>
      <InputFrom
        htmlFor="search"
        labelText="Search Jobs"
        type="text"
        name="search"
        value={search}
        handleChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <Spinner />
      ) : (
        <div className="row">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job._id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{job.position}</h5>
                    <p className="card-text">{job.company} - {job.workLocation}</p>
                    <p className="card-text">{job.description ? job.description.substring(0, 100) : "No description"}...</p>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Jobs;