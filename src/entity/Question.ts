import { IsNotEmpty, MinLength } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Exam } from "./Exam";
import { Answer } from "./Answer";
@Entity("questions")
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    examId: number;

    @Column({ type: 'text' })
    questionText: string;

    // type : kieu du lieu trong DB
    // còn kiểu dữ liệu phía dưới là kiểu dữ liệu trong TS
    @Column({ type: 'int'})
    orderNumber: number;

    @Column({ type: 'text' })
    explanation: string;

    @ManyToOne(() => Exam, exam => exam.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "examId" }) // luôn được đặt phía @ManyToOne
    exam: Exam;

    @OneToMany(() => Answer, answer => answer.question, { cascade: true })
    answers: Answer[];

    @CreateDateColumn()
    createdAt: Date;
}   