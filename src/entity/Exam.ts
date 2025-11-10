import { IsNotEmpty, MinLength } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, Unique, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Question } from "./Question";

@Entity("exams")

export class Exam {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsNotEmpty({ message: "Title is required" })
    @MinLength(3, { message: "Title is too short" })
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: "int", default: 20 })
    totalQuestions: number;

    @Column({ type: "int", default: 60 }) // in minutes
    duration: number;
    
    @Column({type: "boolean", default: true})
    isActive: boolean

    // question : đại diện cho bản ghi Question BẤT KÌ
    // question.exam : đại diện cho exam trong bản ghi Question
    @OneToMany(() => Question, question => question.exam)
    questions: Question[];


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}   