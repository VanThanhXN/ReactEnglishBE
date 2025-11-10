import { AppDataSource } from "../data-source";
import { Exam } from "../entity/Exam";
import { Repository } from "typeorm";
import { Question } from "../entity/Question";
import { Answer } from "../entity/Answer";

export class ExamService {
    private examRepository: Repository<Exam>;
    private questionRepository: Repository<Question>
    private answerRepository: Repository<Answer>
    constructor() {
        this.examRepository = AppDataSource.getRepository(Exam);
        this.questionRepository = AppDataSource.getRepository(Question);
        this.answerRepository = AppDataSource.getRepository(Answer);
    }

    // Partial
    // tham số examData chứa một phần field của entity Exam
    async createExam(examData: Partial<Exam>) {
        const exam = this.examRepository.create(examData);
        return this.examRepository.save(exam);
    }

    async getAllExams() {
        return await this.examRepository.find({
            where: { isActive: true },
            // relations: ["questions", "questions.answers"],
        });
    }

    // Service
    async getExamById(examId: string): Promise<Exam | null> {
        const exam = await this.examRepository.findOne({
            where: { id: examId },
            relations: ["questions", "questions.answers"],
        });
        return exam
    }

    async deleteExam(id: string) {
        const result = await this.examRepository.update(id, { isActive: false });
        return result
    }

    async updateExam(examId: string, updateData: Partial<Exam>) {
        const exam = await this.examRepository.findOne({
            where: { id: examId }
        });
        if (!exam) {
            return null;
        }
        // copy từ updateData vào exam
        Object.assign(exam, updateData);
        return await this.examRepository.save(exam);
    }
}
