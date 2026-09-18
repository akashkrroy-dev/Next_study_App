import express from "express"
import { fetchDashboard, totalAttendance, last7dayTodo } from "./controllers/dashboard.controller.js"
import { verifyUser } from "../../middlewares/validateAccToken.js"
import { apiReadLimiter } from "../../middlewares/rateLimiter.js"

const router = express.Router()

router.get("/", apiReadLimiter, verifyUser, fetchDashboard)
router.get("/total-attendance", apiReadLimiter, verifyUser, totalAttendance)
router.get("/last-week-todos", apiReadLimiter, verifyUser, last7dayTodo)

export default router