import { Router } from "express";
import { UserController } from "../controller/userController";

const userRouter = Router();
userRouter.get("/users", UserController.all);
userRouter.post("/users", UserController.create);
userRouter.get("/users/:id", UserController.findOne);
userRouter.put("/users/:id", UserController.update);
userRouter.delete("/users/:id", UserController.delete);

export default userRouter;