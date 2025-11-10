import { Request, Response } from "express";
import { ExamService } from "../service/examService";

const examService = new ExamService();
export class ExamController {

    static async getAllExams(req: Request, res: Response) {
        const exams = await examService.getAllExams();
        res.status(200).json({
            success: true,
            data: exams
        });
    }

    static async createExams(req: Request, res: Response): Promise<void> {
        const examData = req.body;
        const exam = await examService.createExam(examData);

        res.status(201).json({
            success: true,
            data: exam,
            message: "Exam created successfully"
        });
    }

    // Controller
    static async getExamById(req: Request, res: Response): Promise<void> {
        const examId = req.params.id
        const exam = await examService.getExamById(examId)
        if (!exam) {
            res.status(404).json({
                success: false,
                message: "exam not found"
            })
        }
        res.status(200).json({
            success: true,
            data: exam
        })
    }

    // 
    static async deleteExam(req: Request, res: Response): Promise<void> {
        const examId = req.params.id
        const exam = await examService.deleteExam(examId)

        res.json({
            success: true,
            message: "Exam deleted successfully"
        })
    }

    static async updateExam(req: Request, res: Response): Promise<void> {
        const examId = req.params.id
        const updateData = req.body;

        const exam = await examService.updateExam(examId, updateData);
        if (!exam) {
            res.json({
                success: false,
                message: "Exam not found"
            })
        }
        res.json({
            success: true,
            data: exam,
            message: "Update thanh cong"
        })
    }
}

