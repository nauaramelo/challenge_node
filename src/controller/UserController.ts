import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { TokenGenerator } from "../services/tokenGenerator";
import { UserDataBase } from "../data/UserDataBase";
import { HashGenerator } from "../services/hashGenerator";
import { IdGenerator } from "../services/idGenerator";

export class UserController {
  private static UserBusiness = new UserBusiness(
    new UserDataBase(),
    new HashGenerator(),
    new TokenGenerator(),
    new IdGenerator(),
  );

  public async signUp(req: Request, res: Response) {
      try {
        
        const result = await UserController.UserBusiness.signUp(
            req.body.email,
            req.body.password
        );

        res.status(200).send(result)

      } catch (err) {
        res.status(err.errorCode || 400).send({ message: err.message})
      }
  }

}