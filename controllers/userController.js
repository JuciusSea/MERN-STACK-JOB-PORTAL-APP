import userModel from "../models/userModel.js";

// Cập nhật thông tin người dùng
export const updateUserController = async (req, res, next) => {
  const { name, email, lastName } = req.body;

  if (!name || !email || !lastName) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đủ các trường" });
  }

  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Cập nhật các trường cho phép
    user.name = name;
    user.email = email;
    user.lastName = lastName;

    await user.save();

    const token = user.createJWT();
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        role: user.role, // trả về role
      },
      token,
    });
  } catch (error) {
    console.error("Lỗi trong updateUserController:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy thông tin người dùng
export const getUserController = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        role: user.role, 
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Lỗi trong getUserController:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

