import { Router } from "express";
import { UserController } from "../controller/userController";
import { AuthController } from "../controller/authController";
import { ExamController } from "../controller/examController";


const examRouter = Router();

// CREATE EXAM
examRouter.post("/create-exam", ExamController.createExams);
// GET ALL EXAM
examRouter.get("/get-all-exam", ExamController.getAllExams)
// GET EXAM BY ID
examRouter.get("/exam/:id", ExamController.getExamById)

// UPDATE EXAM
examRouter.patch("/update-exam/:id", ExamController.updateExam)
// DETELE EXAM
examRouter.patch("/delete-exam/:id", ExamController.deleteExam)


export default examRouter;
