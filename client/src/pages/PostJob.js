import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import InputFrom from '../components/shared/InputFrom';
import Spinner from '../components/shared/Spinner';

const PostJob = () => {
  const [position, setPosition] = useState(''); // Changed from title
  const [company, setCompany] = useState('');
  const [workLocation, setWorkLocation] = useState(''); // Changed from location
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState(''); // Added for schema
  const [status, setStatus] = useState(''); // Added for schema
  const { loading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/jobs', { position, company, workLocation, description, workType, status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) {
        toast.success('Job posted successfully');
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Post job error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Post a Job</h1>
      {loading ? (
        <Spinner />
      ) : (
        <form className="card p-3" onSubmit={handleSubmit}>
          <InputFrom
            htmlFor="position"
            labelText="Job Position"
            type="text"
            name="position"
            value={position}
            handleChange={(e) => setPosition(e.target.value)}
          />
          <InputFrom
            htmlFor="company"
            labelText="Company"
            type="text"
            name="company"
            value={company}
            handleChange={(e) => setCompany(e.target.value)}
          />
          <InputFrom
            htmlFor="workLocation"
            labelText="Work Location"
            type="text"
            name="workLocation"
            value={workLocation}
            handleChange={(e) => setWorkLocation(e.target.value)}
          />
          <InputFrom
            htmlFor="workType"
            labelText="Work Type"
            type="text"
            name="workType"
            value={workType}
            handleChange={(e) => setWorkType(e.target.value)}
          />
          <InputFrom
            htmlFor="status"
            labelText="Status"
            type="text"
            name="status"
            value={status}
            handleChange={(e) => setStatus(e.target.value)}
          />
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Post Job</button>
        </form>
      )}
    </Layout>
  );
};

export default PostJob;