import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Job from "../models/jobModel.js";

// Load biến môi trường từ .env
dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Đọc file JSON
const jobsData = JSON.parse(fs.readFileSync("./jobs-data.json", "utf-8"));

// Chuyển đổi dữ liệu để MongoDB hiểu được các định dạng đặc biệt
const formattedJobs = jobsData.map((job) => ({
  ...job,
  createdAt: new Date(job.createdAt.$date),
  createdBy: job.createdBy.$oid,
}));

// Hàm upload
const importData = async () => {
  try {
    await Job.insertMany(formattedJobs);
    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
