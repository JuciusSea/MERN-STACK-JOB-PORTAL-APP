import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

// ====== CREATE JOB ======
export const createJobController = async (req, res, next) => {
  const { title, company, location, description } = req.body;
  if (!title || !company || !location || !description) {
    next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({ job });
};

// ======= GET JOBS ===========
export const getAllJobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  const totalJobs = await jobsModel.countDocuments(queryObject);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

// ======= GET JOB BY ID ===========
export const getJobByIdController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await jobsModel.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: `No job found with ID ${id}` });
    }
    res.status(200).json(job);
  } catch (error) {
    next(`Error fetching job: ${error.message}`);
  }
};

// ======= APPLY JOB ===========
export const applyJobController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await jobsModel.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: `No job found with ID ${id}` });
    }
    // Thêm logic xử lý đơn ứng tuyển nếu cần (ví dụ: lưu ứng viên vào DB)
    res.status(200).json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    next(`Error applying for job: ${error.message}`);
  }
};

// ======= UPDATE JOBS ===========
export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { title, company, location, description } = req.body;
  if (!title || !company || !location || !description) {
    next("Please Provide All Fields");
  }
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`No jobs found with ID ${id}`);
  }
  if (req.user.userId !== job.createdBy.toString()) {
    next("You are not authorized to update this job");
    return;
  }
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updateJob });
};

// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`No job found with ID ${id}`);
  }
  if (req.user.userId !== job.createdBy.toString()) {
    next("You are not authorized to delete this job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
};

// ======= JOB STATS & FILTERS ===========
export const jobStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const defaultStats = {
    pending: stats.find(s => s._id === 'pending')?.count || 0,
    reject: stats.find(s => s._id === 'reject')?.count || 0,
    interview: stats.find(s => s._id === 'interview')?.count || 0,
  };

  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const { _id: { year, month }, count } = item;
      const date = moment().month(month - 1).year(year).format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication });
};