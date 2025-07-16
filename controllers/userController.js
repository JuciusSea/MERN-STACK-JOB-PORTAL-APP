import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
  const { name, email, lastName } = req.body;
  if (!name || !email || !lastName) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.user.userId },
      { name, email, lastName },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const token = user.createJWT();
    res.status(200).json({
      success: true,
      data: { name: user.name, lastName: user.lastName, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Error in updateUserController:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error in getUserController:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};