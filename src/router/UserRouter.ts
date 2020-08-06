import express from 'express';
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

userRouter.post("/", new UserController().signUp);
userRouter.post("/cpf", new UserController().addCpf);
userRouter.post("/full-name", new UserController().addFullName);
userRouter.post("/birthday", new UserController().addBirthday)