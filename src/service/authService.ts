import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { User } from "../entity/User";
import { UserService } from "./userService";

export class AuthService {
  constructor(private readonly userService: UserService) { }

  // Tạo JWT token dựa trên user id
  private signToken(userId: number) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  // Gửi token về client
  private createSendToken(user: User, statusCode: number, res: any) {
    const token = this.signToken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
      status: "success",
      token,
      data: { user },
    });
  }

  // Signup logic
  async signup(req: any, res: any) {
    const { name, email, password, passwordConfirm } = req.body;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const newUser = await this.userService.createUser({
      name, email, password, passwordConfirm
    });
    this.createSendToken(newUser, 201, res);
  }

  // Login
  async login(req: any, res: any) {
    const { email, password } = req.body;
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }
    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
    this.createSendToken(user, 200, res);
  }

  async protect(req: any, res: any) {
    // 1) Get token, 
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      // get cookies by name jwt
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // 3) Check if user still exists
    const currentUser = await this.userService.findOne(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }


    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "User recently changed password! Please log in again.",
      });
    }



  }
}
