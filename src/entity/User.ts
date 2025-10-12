import { IsNotEmpty, Min } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"

@Entity()
@Unique(["email"])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty({ message: "Name is required" })
    @Min(6, { message: "Name is too short" })
    name: string

    @Column()
    @IsNotEmpty({ message: "Name is required" })
    email: string

    @Column()
    photo: String

    @Column()
    @IsNotEmpty({ message: "Name is required" })
    password: String

    @Column()
    @IsNotEmpty({ message: "Name is required" })
    passwordConfirm: String

    @Column({ default: "user" })
    role: String
    enum: ["user", "admin"]

    @Column()
    isActive: Boolean

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date


}
