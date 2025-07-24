import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await userModel.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Gán role và userId vào request
    req.user = {
      userId: user._id.toString(),
      role: user.role || 'user', // mặc định là "user" nếu chưa có
    };

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export default userAuth;
