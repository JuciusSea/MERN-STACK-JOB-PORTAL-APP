import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUser } from '../redux/features/auth/authSlice';
import Layout from '../components/Layout/Layout';
import InputFrom from '../components/shared/InputFrom';
import Spinner from '../components/shared/Spinner';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      setName(user.name || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/v1/user/update-user', { name, lastName, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (data.success) {
        dispatch(setUser(data.data));
        toast.success('Profile updated successfully');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <h1 className="text-center">Update Profile</h1>
      <form className="card p-3" onSubmit={handleSubmit}>
        <InputFrom
          htmlFor="name"
          labelText="Name"
          type="text"
          name="name"
          value={name}
          handleChange={(e) => setName(e.target.value)}
        />
        <InputFrom
          htmlFor="lastName"
          labelText="Last Name"
          type="text"
          name="lastName"
          value={lastName}
          handleChange={(e) => setLastName(e.target.value)}
        />
        <InputFrom
          htmlFor="email"
          labelText="Email"
          type="email"
          name="email"
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </Layout>
  );
};

export default Profile;