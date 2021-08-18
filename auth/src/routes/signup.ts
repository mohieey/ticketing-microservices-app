import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  RequestValidationError,
  BadRequestError,
  validateRequest,
} from "@ticmoh/common";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    const newUser = User.build({ email, password });
    await newUser.save();

    const userJWT = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJWT };

    return res.status(201).send(newUser);
  }
);

export { router as signupRouter };
