import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
            <Route path="/jobs/:id" element={<PrivateRoute><JobDetail /></PrivateRoute>} />
            <Route path="/post-job" element={<PrivateRoute><PostJob /></PrivateRoute>} />
            <Route path="/user/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;