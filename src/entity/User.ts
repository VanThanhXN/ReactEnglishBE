import { IsNotEmpty, MinLength } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm"
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';


export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
@Entity()
@Unique(["email"])
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    @IsNotEmpty({ message: "Name is required" })
    @MinLength(6, { message: "Name is too short" })  
    name: string

    @Column()
    @IsNotEmpty({ message: "Email is required" })
    email: string

    @Column({ nullable: true })
    photo: string

    @Column({ select: false })
    @IsNotEmpty({ message: "Password is required" })
    password: string

    @Column({ nullable: true })
    @IsNotEmpty({ message: "PasswordConfirm is required" })
    passwordConfirm: String

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole


    @Column({ default: true })
    isActive: Boolean

    @Column({ type: 'timestamp', nullable: true })
    passwordChangedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    passwordResetToken: String;

    @Column({ type: 'timestamp', nullable: true })
    passwordResetExpires: Date;


    @BeforeInsert()
    @BeforeUpdate()
    // Hash password 
    async hashPassword() {
        try {
            if (this.password) {
                if (this.password !== this.passwordConfirm) {
                    throw new Error("Passwords do not match");
                }

                // 
                if (!this.password.startsWith("$2")) {
                    this.password = await bcrypt.hash(this.password, 12);
                    this.passwordConfirm = undefined;
                }
            }
        } catch (error) {
            throw new Error("Error hashing password: " + error.message);
        }
    }

    // Compare password
    async correctPassword(candidatePassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, this.password);
    }


    async changedPasswordAfter(JWTTimestamp: number): Promise<boolean> {
        if (this.passwordChangedAt) {
            const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
            return JWTTimestamp < changedTimestamp;
        }
        return false;
    }
}
