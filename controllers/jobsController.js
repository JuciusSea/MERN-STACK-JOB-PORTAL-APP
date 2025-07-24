import Job from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";

// ====== CREATE JOB ======
export const createJobController = async (req, res, next) => {
  const { position, company, workLocation, description, workType, status } = req.body;
  if (!position || !company || !workLocation || !workType || !status) {
    return next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Error in createJobController:', error);
    next(error.message);
  }
};

// ======= GET JOBS ===========
export const getAllJobsController = async (req, res, next) => {
  try {
    const jobs = await Job.find({});
    console.log('Jobs fetched:', jobs); // Debug log
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Error in getAllJobsController:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======= GET JOB BY ID ===========
export const getJobByIdController = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Error in getJobByIdController:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======= APPLY JOB ===========
export const applyJobController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: `No job found with ID ${id}` });
    }
    if (job.applicants.includes(req.user.userId)) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }
    job.applicants.push(req.user.userId);
    await job.save();
    res.status(200).json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error('Error in applyJobController:', error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};


// ======= GET APPLICATION STATUS ===========
export const getApplicationStatusController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: `No job found with ID ${id}` });
    }
    const status = job.applicants && job.applicants.includes(req.user.userId) ? 'applied' : 'not_applied';
    res.status(200).json({ success: true, status });
  } catch (error) {
    console.error('Error in getApplicationStatusController:', error);
    next(error.message);
  }
};

// ======= UPDATE JOBS ===========
export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { position, company, workLocation, description, workType, status } = req.body;
  if (!position || !company || !workLocation || !workType || !status) {
    return next("Please Provide All Fields");
  }
  try {
    const job = await Job.findOne({ _id: id });
    if (!job) {
      return next(`No jobs found with ID ${id}`);
    }
    if (req.user.userId !== job.createdBy.toString()) {
      return next("You are not authorized to update this job");
    }
    const updateJob = await Job.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, job: updateJob });
  } catch (error) {
    console.error('Error in updateJobController:', error);
    next(error.message);
  }
};

// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findOne({ _id: id });
    if (!job) {
      return next(`No job found with ID ${id}`);
    }
    if (req.user.userId !== job.createdBy.toString()) {
      return next("You are not authorized to delete this job");
    }
    await job.deleteOne();
    res.status(200).json({ success: true, message: "Success, Job Deleted!" });
  } catch (error) {
    console.error('Error in deleteJobController:', error);
    next(error.message);
  }
};

// ======= JOB STATS & FILTERS ===========
export const jobStatsController = async (req, res) => {
  try {
    const stats = await Job.aggregate([
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

    let monthlyApplication = await Job.aggregate([
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

    res.status(200).json({ success: true, totalJobs: stats.length, defaultStats, monthlyApplication });
  } catch (error) {
    console.error('Error in jobStatsController:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};