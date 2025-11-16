import { Repository, UpdateResult } from "typeorm";
import { UserAnswer } from "../entity/UserAnswer";
import { UserExamAttempt } from "../entity/UserExamAttempt";
import { Exam } from "../entity/Exam";
import { Answer } from "../entity/Answer";
import { AppDataSource } from "../data-source";

export class UserExamService {
    private attemptRepository = AppDataSource.getRepository(UserExamAttempt);
    private userAnswerRepository = AppDataSource.getRepository(UserAnswer);
    private examRepository = AppDataSource.getRepository(Exam);
    private answerRepository = AppDataSource.getRepository(Answer);

    async startExam(userId: string, examId: number) {
        const exam = await this.examRepository.findOne({
            where: { id: examId },
            relations: ["questions"]
        })
        if (!exam) {
            throw new Error("Exam not found");
        }
        const attempt = this.attemptRepository.create({
            userId,
            examId,
            startedAt: new Date(),
            totalQuestions: exam.totalQuestions
        })
        return await this.attemptRepository.save(attempt)
    }
    async submitAnswer(attemptId: number, questionId: number, answerId: number) {
        const attemp = await this.attemptRepository.findOne({
            where: { id: attemptId }
        })
        if (!attemp) {
            throw new Error("Exam is not in progress")
        }
        const answer = await this.answerRepository.findOne({
            where: { id: answerId }
        })
        if (!answer) {
            throw new Error("Answer not found");
        }
        // kiem tra xem da tra loi hay chua
        let userAnswer = await this.userAnswerRepository.findOne({
            where: { attemptId, questionId }
        })
        // neu đã trả lời rồi, cập nhật đáp án và isCorrect
        if (userAnswer) {
            userAnswer.answerId = answerId;
            // để mà biết ng dùng làm đúng hay sai thì cần so sánh với bảng answer
            userAnswer.isCorrect = answer.isCorrect
        } else {
            userAnswer = await this.userAnswerRepository.create({
                attemptId, questionId, answerId, isCorrect: answer.isCorrect
            })
        }
        return await this.userAnswerRepository.save(userAnswer)
    }
    async submitExam(attemptId: number) {
        const attempt = await this.attemptRepository.findOne({
            where: { id: attemptId },
            relations: ["userAnswers", "exam"]
        });

        if (!attempt) {
            throw new Error("Attempt not found");
        }

        if (attempt.status !== "in_progress") {
            throw new Error("Exam is already completed");
        }

        // Tính điểm
        const correctAnswers = attempt.userAnswers.filter(ua => ua.isCorrect).length;
        const totalQuestions = attempt.exam.totalQuestions;
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        // Tính thời gian làm bài
        const timeSpent = Math.floor(
            (new Date().getTime() - attempt.startedAt.getTime()) / 1000
        );

        // Cập nhật attempt
        attempt.completedAt = new Date();
        attempt.status = "completed";
        attempt.score = score;
        attempt.correctAnswers = correctAnswers;
        attempt.timeSpent = timeSpent;

        return await this.attemptRepository.save(attempt);

    }
    async getExamResult(attemptId: number): Promise<UserExamAttempt | null> {
        return await this.attemptRepository.findOne({
            where: { id: attemptId },
            relations: [
                "exam",
                "userAnswers",
                "userAnswers.question",
                "userAnswers.question.answers",
            ]
        });
    }
}