import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  workLocation: { type: String, required: true },
  description: { type: String, default: "" },
  workType: { type: String, required: true },
  status: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Job", jobSchema);