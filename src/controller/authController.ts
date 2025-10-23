import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserService } from "../service/userService";
import { AuthService } from "../service/authService";
import { userRepository } from "../repository/userRepository";

const userService = new UserService(userRepository);
const authService = new AuthService(userService);

export class AuthController {

  static async signup(req: Request, res: Response) {
    await authService.signup(req, res);
  }

  static async login(req: Request, res: Response) {
    await authService.login(req, res);
  }

  // Check if user has token
  static async protect (req: Request, res: Response) {
    await authService.protect(req, res);
  }


}
