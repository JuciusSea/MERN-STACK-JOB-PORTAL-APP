import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password, lastName } = req.body;

    // Validate
    if (!name) return next("Name is required");
    if (!email) return next("Email is required");
    if (!password || password.length < 6) {
      return next("Password is required and must be at least 6 characters");
    }

    // Check if email đã tồn tại
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next("Email already registered. Please login.");
    }

    // Kiểm tra tổng số tài khoản hiện có
    const userCount = await userModel.countDocuments();

    // Gán role: admin nếu là người đầu tiên, ngược lại là user
    const role = userCount === 0 ? "admin" : "user";

    // Tạo người dùng
    const user = await userModel.create({
      name,
      email,
      password,
      lastName,
      role, // <- thêm role
    });

    const token = user.createJWT();

    res.status(201).send({
      success: true,
      message: "User Created Successfully",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    return next("Something went wrong in registration");
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    next("Please Provide All Fields");
  }
  //find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid Useraname or password");
  }
  //compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next("Invalid Useraname or password");
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login success",
    token,
    user: {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

export const createEmployeeController = async (req, res) => {
  try {
    const { name, lastName, email, password, location } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const newUser = await userModel.create({
      name,
      lastName,
      email,
      password,
      location,
      role: "employee",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in createEmployeeController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};