import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout/Layout';
import InputFrom from '../components/shared/InputFrom';
import Spinner from '../components/shared/Spinner';

const CreateEmployeePage = () => {
  const { loading } = useSelector((state) => state.alerts);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/auth/create-employee', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        toast.success('Employee created successfully');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Create employee error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error creating employee');
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <h1 className="text-center">Create Employee Account</h1>
      <form className="card p-3" onSubmit={handleSubmit}>
        <InputFrom
          htmlFor="name"
          labelText="Name"
          type="text"
          name="name"
          value={form.name}
          handleChange={handleChange}
        />
        <InputFrom
          htmlFor="lastName"
          labelText="Last Name"
          type="text"
          name="lastName"
          value={form.lastName}
          handleChange={handleChange}
        />
        <InputFrom
          htmlFor="email"
          labelText="Email"
          type="email"
          name="email"
          value={form.email}
          handleChange={handleChange}
        />
        <InputFrom
          htmlFor="password"
          labelText="Password"
          type="password"
          name="password"
          value={form.password}
          handleChange={handleChange}
        />
        <InputFrom
          htmlFor="location"
          labelText="Location"
          type="text"
          name="location"
          value={form.location}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">Create Employee</button>
      </form>
    </Layout>
  );
};

export default CreateEmployeePage;
