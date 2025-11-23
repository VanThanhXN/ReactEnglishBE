import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1763879045395 implements MigrationInterface {
    name = 'CreateUserTable1763879045395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "flashcards" ("id" SERIAL NOT NULL, "deckId" integer NOT NULL, "front" character varying(255) NOT NULL, "back" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9acf891ec7aaa7ca05c264ea94d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "flashcard_decks" ("id" SERIAL NOT NULL, "userId" uuid, "name" character varying(255) NOT NULL, "description" text, "totalCards" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b7013fe6cf1a9b4dd13e97d01d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "photo" character varying, "password" character varying NOT NULL, "passwordConfirm" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "passwordChangedAt" TIMESTAMP, "passwordResetToken" text, "passwordResetExpires" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "answerText" text NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "explanation" text, "option" character(1) NOT NULL, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_answers" ("id" SERIAL NOT NULL, "attemptId" integer NOT NULL, "questionId" integer NOT NULL, "answerId" integer, "isCorrect" boolean NOT NULL DEFAULT false, "timeSpent" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08977c1a2a5f1b8b472dbd87d04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "examId" integer NOT NULL, "questionText" text NOT NULL, "orderNumber" integer NOT NULL, "explanation" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exams" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "totalQuestions" integer NOT NULL, "duration" integer NOT NULL DEFAULT '60', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b43159ee3efa440952794b4f53e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_exam_attempts" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "examId" integer NOT NULL, "startedAt" TIMESTAMP, "completedAt" TIMESTAMP, "score" integer, "correctAnswers" integer, "totalQuestions" integer, "status" character varying(20) NOT NULL DEFAULT 'in_progress', "timeSpent" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3a354b30f187da1d485b023eeaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flashcards" ADD CONSTRAINT "FK_3a8fb45d6c8da92b5c3e2e390c3" FOREIGN KEY ("deckId") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flashcard_decks" ADD CONSTRAINT "FK_e0c098b77071057333af0686635" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_c8e6e678d62072038900fe3db5a" FOREIGN KEY ("attemptId") REFERENCES "user_exam_attempts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_47a3ffddaba37b9707f93e4b140" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_answers" ADD CONSTRAINT "FK_c4731694c2bc85d2b5acc0cee37" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_32cd92f2cd6b9438d6425bff0b8" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_exam_attempts" ADD CONSTRAINT "FK_0982d1d7c5aad75f19db8a30d80" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_exam_attempts" ADD CONSTRAINT "FK_39893c4c87e0645353d41cd1466" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_exam_attempts" DROP CONSTRAINT "FK_39893c4c87e0645353d41cd1466"`);
        await queryRunner.query(`ALTER TABLE "user_exam_attempts" DROP CONSTRAINT "FK_0982d1d7c5aad75f19db8a30d80"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_32cd92f2cd6b9438d6425bff0b8"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_c4731694c2bc85d2b5acc0cee37"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_47a3ffddaba37b9707f93e4b140"`);
        await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "FK_c8e6e678d62072038900fe3db5a"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`);
        await queryRunner.query(`ALTER TABLE "flashcard_decks" DROP CONSTRAINT "FK_e0c098b77071057333af0686635"`);
        await queryRunner.query(`ALTER TABLE "flashcards" DROP CONSTRAINT "FK_3a8fb45d6c8da92b5c3e2e390c3"`);
        await queryRunner.query(`DROP TABLE "user_exam_attempts"`);
        await queryRunner.query(`DROP TABLE "exams"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "user_answers"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "flashcard_decks"`);
        await queryRunner.query(`DROP TABLE "flashcards"`);
    }

}
