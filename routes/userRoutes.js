import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controllers/userController.js";
import userAuth from "../middlewares/authMiddleware.js"; // Fixed path

//router object
const router = express.Router();

//routes
// GET USER DATA || POST
router.post("/getUser", userAuth, getUserController);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUserController);

export default router;