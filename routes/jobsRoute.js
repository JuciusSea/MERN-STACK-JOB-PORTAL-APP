import express from "express";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  getJobByIdController,
  applyJobController,
  jobStatsController,
  updateJobController,
} from "../controllers/jobsController.js";
import userAuth from "../middelwares/authMiddleware.js";

const router = express.Router();

// CREATE JOB || POST
router.post("/", userAuth, createJobController);

// GET ALL JOBS || GET
router.get("/", userAuth, getAllJobsController);

// GET JOB BY ID || GET
router.get("/:id", userAuth, getJobByIdController);

// APPLY JOB || POST
router.post("/:id/apply", userAuth, applyJobController);

// UPDATE JOB || PATCH
router.patch("/update-job/:id", userAuth, updateJobController);

// DELETE JOB || DELETE
router.delete("/delete-job/:id", userAuth, deleteJobController);

// JOB STATS FILTER || GET
router.get("/job-stats", userAuth, jobStatsController);

export default router;