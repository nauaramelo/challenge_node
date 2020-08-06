import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { TokenGenerator } from "../services/tokenGenerator";
import { UserDataBase } from "../data/UserDataBase";
import { HashGenerator } from "../services/hashGenerator";
import { IdGenerator } from "../services/idGenerator";
import { CpfDataBase } from "../data/CpfDataBase";

export class UserController {
  private static UserBusiness = new UserBusiness(
    new UserDataBase(),
    new HashGenerator(),
    new TokenGenerator(),
    new IdGenerator(),
    new CpfDataBase()
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

  public async addCpf(req: Request, res: Response) {
    try {
      
      const result = await UserController.UserBusiness.addCpf(
        req.body.token,
        req.body.cpf 
      );
  
      res.status(200).send({ message: "Sucess"})

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

}