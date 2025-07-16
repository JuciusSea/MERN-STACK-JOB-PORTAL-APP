import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import InputFrom from '../components/shared/InputFrom';
import Spinner from '../components/shared/Spinner';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const { loading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/jobs', { title, company, location, description }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success) {
        toast.success('Job posted successfully');
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Post job error:', error);
      toast.error('Failed to post job');
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
            htmlFor="title"
            labelText="Job Title"
            type="text"
            name="title"
            value={title}
            handleChange={(e) => setTitle(e.target.value)}
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
            htmlFor="location"
            labelText="Location"
            type="text"
            name="location"
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
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